import { DoneCallback, Job } from 'bull';
import config from 'config';
import throng from 'throng';
import sendgrid from '@sendgrid/mail';

import EmailQueue from './modules/EmailModule/EmailQueue';
import { EMailType } from './types/enums/EMailType';
import MailService from './modules/EmailModule/MailService';
import { IMailer } from './types/interfaces/IMailer';

const { workers } = config.get('queue');
const { apiKey } = config.get('mail');

sendgrid.setApiKey(apiKey);

const maxJobsPerWorker = 50;

function start() {
  EmailQueue.process(maxJobsPerWorker, async (job: Job<IMailer>, done: DoneCallback) => {
    const mailService = new MailService();
    const { emailType, ...data } = job.data;

    try {
      if (emailType === EMailType.SENDGRID) {
        const gridResponse = await mailService.sendWithSendGrid(data);
        return done(null, gridResponse);
      }

      const {
        subject,
        to: toEmailObj,
        templateId: template,
        templateData: payload,
        priority,
      } = data;

      const gmailResponse = await mailService.sendWithGmail(
        subject,
        toEmailObj,
        template,
        payload,
        priority
      );
      return done(null, gmailResponse);
    } catch ({ message }) {
      done(new Error(message));
    }
  });
}

throng({ workers, start });
