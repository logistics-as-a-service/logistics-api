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
}

export default new Server();
