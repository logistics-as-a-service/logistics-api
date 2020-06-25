import config from 'config';
import { classes } from '@sendgrid/helpers';

import { IMailer } from '../../types/interfaces/IMailer';
import EmailQueue from './EmailQueue';

const { Mail } = classes;

const { sender_name, sender_email } = config.get('mail');

export default class SenderService {
  static send(data: IMailer): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        data.isBulkMail = false;
        // tslint:disable-next-line: no-unused-expression
        data.replyTo ? data.replyTo : 'no-reply@meatify.ng';

        if (data.to.length > 1) {
          throw new Error('Bulk mail is currently disabled!');
        }

        if (!data.from && typeof data.from !== 'object') {
          Object.assign(data, { from: { name: sender_name, email: sender_email } });
        }

        const mailStruct = {
          from: data.from,
          reply_to: data.replyTo,
          subject: data.subject,
          templateId: data.templateId,
          dynamicTemplateData: {
            ...data.templateData,
            subject: data.subject,
            header: data.preHeader ? data.preHeader : data.subject,
          },
          personalizations: data.to.map((info) => {
            if (typeof info === 'string') {
              return { to: [{ name: info, email: info }] };
            } else {
              return { to: [{ name: info.name, email: info.email }] };
            }
          }),
          isMultiple: true,
          substitutionWrappers: ['{{', '}}'],
        };

        const mail = new Mail();
        mail.fromData(mailStruct);

        const job = await EmailQueue.add(
          { emailType: data.emailType, ...mail.toJSON() },
          { priority: data.priority }
        );
        return resolve({ job });
      } catch ({ message }) {
        return reject(new Error(message));
      }
    });
  }
}
