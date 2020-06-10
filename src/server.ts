import log from 'fancy-log';
import config from 'config';

import App from './app';

const { port: dbPort, env } = config.get('general');

class Server {
  server: any;

  express: App;

  constructor() {
    this.express = new App();

    const serverPort = parseInt(env === 'test' ? 8378 : dbPort, 10) || 80;

    this.server = this.express.app.listen(serverPort, async () => {
      log(`Server is running on http://localhost:${serverPort} `);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  // private async setupDatabase() {
  //   try {
  //     await createConnection({
  //       name: 'default',
  //       type,
  //       host,
  //       port,
  //       username,
  //       password,
  //       database,
  //       entities: [`${__dirname}/database/models/*.ts`],
  //       synchronize: true,
  //     });

  //     log(`${type.toUpperCase()} Database Connected`);
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // }
}

export default new Server();
