// tslint:disable-next-line: no-var-requires
require('dotenv').config();

import { URL } from 'url';

const REDIS_HOST = process.env.LOGISTICS_REDIS_HOST;
const REDIS_PORT = process.env.LOGISTICS_REDIS_PORT;
const REDIS_PASSWORD = process.env.LOGISITICS_REDIS_PASSWORD;

const redisUrl = new URL(
  process.env.LOGISTICS_REDIS_URL || `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}/0`
);

module.exports = {
  general: {
    env: 'production',
    baseUrl: process.env.LOGISTICS_BASE_URL,
    port: process.env.PORT || 3000,
  },
  redis: {
    host: redisUrl.hostname,
    port: parseInt(redisUrl.port || '6379', 10),
    db: parseInt((redisUrl.pathname || '/0').substr(1) || '0', 10),
    password: redisUrl.password ? decodeURIComponent(redisUrl.password) : undefined,
    prefix: 'logistics:',
  },
};
