import * as path from 'path';
import config from 'config';

const { type, host, port, username, password, name } = config.get('database');

const srcPath = (...segments: string[]) => path.join(__dirname, '../database', ...segments);

const conneection = {
  name: 'default',
  type,
  host,
  port,
  username,
  password,
  database: name,
  entities: [srcPath('entity', '*{.ts,.js}')],
  migrations: [srcPath('migration', '*{.ts,.js}')],
  subscribers: [srcPath('subscriber', '*{.ts,.js}')],
  synchronize: true,
  migrationsTableName: '_migrations',
  // logging: true,
  cli: {
    migrationsDir: srcPath('migration'),
  },
  keepConnectionAlive: true,
};

if (module) {
  module.exports = conneection;
}

// tslint:disable-next-line: no-unused-expression
export default conneection;
