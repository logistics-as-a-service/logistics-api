import { URL } from 'url';

const REDIS_HOST = process.env.LOGISTICS_REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.LOGISTICS_REDIS_PORT || '6379';

const redisUrl = new URL(process.env.LOGISTICS_REDIS_URL || `redis://${REDIS_HOST}:${REDIS_PORT}/`);

export default {
  general: {
    env: 'production',
    baseUrl: process.env.LOGISTICS_BASE_URL,
    port: process.env.LOGISTICS_SERVER_PORT || 3000
  },
  redis: {
    host: redisUrl.hostname || '127.0.0.1',
    port: parseInt(redisUrl.port || '6379', 10),
    db: parseInt((redisUrl.pathname || '/0').substr(1) || '0', 10),
    password: redisUrl.password ? decodeURIComponent(redisUrl.password) : undefined,
    prefix: 'sam:'
  }
};
