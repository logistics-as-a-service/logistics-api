// tslint:disable-next-line: no-var-requires
require('dotenv').config();

import { URL } from 'url';

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || '6379';

const redisUrl = new URL(process.env.REDIS_URL || `redis://${REDIS_HOST}:${REDIS_PORT}/`);

export default {
  general: {
    env: 'development',
    baseUrl: process.env.BASE_URL,
    port: process.env.PORT || 3000
  },
  redis: {
    host: redisUrl.hostname || 'localhost',
    port: parseInt(redisUrl.port || '6379', 10),
    db: parseInt((redisUrl.pathname || '/0').substr(1) || '0', 10),
    password: redisUrl.password ? decodeURIComponent(redisUrl.password) : undefined,
    prefix: 'sam:'
  },
  database: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'logistics-service'
  }
};
