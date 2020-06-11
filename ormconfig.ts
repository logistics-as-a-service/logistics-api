import config from 'config';

const { type, host, port, username, password, database } = config.get('database');

const conneection = {
  name: 'default',
  type,
  host,
  port,
  username,
  password,
  database,
  entities: [`src/database/entity/*.ts`],
  migrations: [`src/database/migration/*.ts`],
  subscribers: ['src/database/subscriber/*.ts'],
  synchronize: true,
  // logging: true,
  cli: {
    migrationsDir: `src/database/migration`
  }
};

if (module) {
  module.exports = conneection;
}

// tslint:disable-next-line: no-unused-expression
export default conneection;
