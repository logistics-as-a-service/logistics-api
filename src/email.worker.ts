import { DoneCallback, Job } from 'bull';
import config from 'config';
import throng from 'throng';
import sendgrid from '@sendgrid/mail';
import EmailQueue from './modules/EmailModule/EmailQueue';

const { workers } = config.get('queue');
const { api_key } = config.get('mail');

sendgrid.setApiKey(api_key);

const maxJobsPerWorker = 50;

function start() {
  EmailQueue.process(maxJobsPerWorker, async (job: Job, done: DoneCallback) => {
    const { isMultiple, ...data } = job.data;

    try {
      const response = await sendgrid.send(data, isMultiple);
      done(null, response);
    } catch ({ message }) {
      done(new Error(message));
    }
  });
}

throng({ workers, start });
