import { EmailJSON, EmailData } from '@sendgrid/helpers/classes/email-address';

export interface IMailer {
  to: EmailData[];
  from: string | EmailJSON;
  replyTo: EmailData;
  subject: string;
  templateId: string;
  isMultiple: boolean;
  dynamicTemplateData: object;
  templateData: object;
  preHeader: string;
  priority: number;
  substitutionWrappers: string[];
  isBulkMail: boolean;
  personalizations: EmailData[]; // array of name, email
}
