// tslint:disable-next-line: no-var-requires
require('dotenv').config();

import { URL } from 'url';

const resetPasswordExp = Math.floor(Date.now() / 1000) + 60 * 60 * 1; // 1hours

const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24hours
const refreshExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 days

const REDIS_HOST = process.env.LOGISTICS_REDIS_HOST;
const REDIS_PORT = process.env.LOGISTICS_REDIS_PORT;
const REDIS_PASSWORD = process.env.LOGISITICS_REDIS_PASSWORD;
// const REDIS_DATABASE_NAME = process.env.LOGISTICS_REDIS_DATABASE_NAME;

const redisUrl = new URL(
  process.env.LOGISTICS_REDIS_URL || `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}/0`
);

module.exports = {
  general: {
    env: 'development',
    baseUrl: process.env.LOGISTICS_BASE_URL,
    fontendUrl: process.env.LOGISTICS_FONTEND_URL,
    port: process.env.PORT || 3000,
    maxUploadFileSize: process.env.LOGISTICS_MAX_UPLOAD_SIZE || 10 * 1024 * 1024, // 100MB,
  },
  redis: {
    host: redisUrl.hostname,
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
  smtp: {
    user: process.env.LOGISTICS_EMAIL_USER,
    clientId: process.env.LOGISTICS_CLIENT_ID,
    clientSecret: process.env.LOGISTICS_CLIENT_SECRET,
    refreshToken: process.env.LOGISTICS_USER_REFRESH_TOKEN,
    accessToken: process.env.LOGISTICS_ACCESS_TOKEN,
  },
  mail: {
    apiKey: process.env.LOGISTICS_SENDGRID_API_KEY,
    apiKey_id: process.env.LOGISTICS_SENDGRID_KEY_ID,
    senderName: process.env.LOGISTICS_SENDER_NAME,
    senderEmail: process.env.LOGISTICS_SENDER_MAIL,
  },
  s3: {
    secret: process.env.LOGISTICS_AWS_SECRET,
    key: process.env.LOGISTICS_AWS_KEY,
    region: process.env.LOGISTICS_AWS_REGION,
    bucket: process.env.LOGISTICS_AWS_BUCKET,
  },
};
