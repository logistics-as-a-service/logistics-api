import path from 'path';
import config from 'config';
import Mailer from 'nodemailer';
import EmailTemplate from 'email-templates';
import sendgrid from '@sendgrid/mail';

import { ISmtpSettings } from '../../types/interfaces/ISmtpSettings';

const smtpSttings: ISmtpSettings = config.get('smtp');
const { apiKey, senderName, senderEmail } = config.get('mail');

const MAIL_HOST = 'smtp.gmail.com';
const MAIL_PORT = 465;

sendgrid.setApiKey(apiKey);

const { user, clientId, clientSecret, refreshToken, accessToken } = smtpSttings;

export default class MailService {
  // Method to create mail transporter
  private getTransporter() {
    return Mailer.createTransport({
      host: MAIL_HOST,
      port: MAIL_PORT,
      secure: true,
      auth: {
        type: 'OAuth2',
        user,
        clientId,
        clientSecret,
        refreshToken,
        accessToken,
      },
      // tls: { rejectUnauthorized: false },
    });
  }

  // 1. Send mail locally using template
  async sendWithGmail(subject, toEmailObj, template, payload, priority) {
    return new Promise((resolve, reject) => {
      const to = toEmailObj.map(({ name, email }) => `"${name}" <${email}>`);

      const templateRoot = path.resolve('src/mail');

      const emailSender = new EmailTemplate({
        send: true,
        preview: false,
        htmlToText: false,
        views: {
          root: templateRoot,
          options: { extension: 'hbs', map: { hbs: 'handlebars' } },
        },
        message: {
          from: `"${senderName}" <${senderEmail}>`,
          priority: priority === 1 ? 'high' : 'normal',
        },
        transport: this.getTransporter(),
      });

      emailSender
        .send({
          message: { subject, to },
          template,
          locals: payload, // template variables
        })
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Send mail via Sendgrid server
   * @param {object} data payload
   */
  async sendWithSendGrid(data) {
    const { isMultiple, ...payload } = data;

    try {
      await sendgrid.send(payload, isMultiple);

      return { status: true, message: 'Message send successfully!' };
    } catch ({ message }) {
      return { status: false, message };
    }
  }

  /**
   * Extract contacts from data
   * @param {array} data
   */
  extractContacts(data) {
    const result = data.map((info) => {
      let [first_name, last_name] = info.name.split(' ');

      first_name = first_name ? first_name.trim() : '';
      last_name = last_name ? last_name.trim() : '';

      return { first_name, last_name, email: info.email };
    });

    return result;
  }

  /**
   * Split name and email address from string
   */
  splitNameEmail(str) {
    if (str.indexOf('<') === -1) {
      return ['', str];
    }

    let [name, email] = str.split('<');

    name = name.trim();
    email = email.replace('>', '').trim();

    return [name, email];
  }
}
