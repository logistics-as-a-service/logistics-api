// tslint:disable-next-line: no-var-requires
require('dotenv').config();

import { URL } from 'url';

const resetPasswordExp = Math.floor(Date.now() / 1000) + 60 * 60 * 1; // 1hours

const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24hours
const refreshExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 days

const REDIS_HOST = process.env.LOGISTICS_REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.LOGISTICS_REDIS_PORT || '6379';

const redisUrl = new URL(process.env.LOGISTICS_REDIS_URL || `redis://${REDIS_HOST}:${REDIS_PORT}/`);

export default {
  general: {
    env: 'development',
    baseUrl: process.env.LOGISTICS_BASE_URL,
    fontendUrl: process.env.LOGISTICS_FONTEND_URL,
    port: process.env.LOGISTICS_SERVER_PORT || 3000,
  },
  redis: {
    host: redisUrl.hostname || 'localhost',
    port: parseInt(redisUrl.port || '6379', 10),
    db: parseInt((redisUrl.pathname || '/0').substr(1) || '0', 10),
    password: redisUrl.password ? decodeURIComponent(redisUrl.password) : undefined,
    prefix: 'logistics:',
  },
  auth: {
    secret: process.env.LOGISTICS_JWT_SECRET,
    refreshSecret: process.env.LOGISTICS_JWT_REFRESH_SECRET,
    signOptions: { expiresIn: exp, refreshExpIn: refreshExp },
    resetPasswordExp,
  },
  queue: {
    name: process.env.LOGISTICS_QUEUE_NAME || 'mailer',
    workers: process.env.LOGISTICS_WEB_CONCURRENCY || 2,
  },
  database: {
    type: process.env.LOGISTICS_DB_TYPE || 'postgres',
    host: process.env.LOGISTICS_DB_HOST,
    port: process.env.LOGISTICS_DB_PORT,
    username: process.env.LOGISTICS_DB_USERNAME,
    password: process.env.LOGISTICS_DB_PASSWORD,
    name: process.env.LOGISTICS_DB_NAME,
  },
  mail: {
    api_key: process.env.LOGISTICS_SENDGRID_API_KEY,
    api_key_id: process.env.LOGISTICS_SENDGRID_KEY_ID,
    sender_name: process.env.LOGISTICS_SENDER_NAME,
    sender_email: process.env.LOGISTICS_SENDER_MAIL,
  },
  s3: {
    maxUploadFileSize: process.env.LOGISTICS_MAX_UPLOAD_SIZE || 1 * 1024 * 1024, // 100MB,
    secret: process.env.LOGISTICS_AWS_SECRET,
    key: process.env.LOGISTICS_AWS_KEY,
    region: process.env.LOGISTICS_AWS_REGION,
    bucket: process.env.LOGISTICS_AWS_BUCKET,
  },
};
