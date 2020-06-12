import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import log from 'fancy-log';
import lusca from 'lusca';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import config from 'config';
import { LogisticsEmitter, EventType } from './Utils/Emittery';
import './database/DbConnection';

// import routes from './routes';

const { env } = config.get('general');
const isProduction = env === 'production';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.middleware();
    // this.routes();
    this.errorHandler();
    this.loadEventListeners();
  }

  private middleware() {
    const corsOptions = {
      credentials: true,
      origin: [],
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    };

    this.app.use(cors(corsOptions));
    this.app.use(lusca.xframe('SAMEORIGIN'));
    this.app.use(lusca.xssProtection(true));

    // compression and header security middleware
    this.app.use(compression());
    this.app.use(helmet());

    // this.app.use(passport.initialize());

    this.app.use(morgan('dev'));

    this.app.use(
      bodyParser.urlencoded({
        limit: '50mb',
        extended: true,
      })
    );
    this.app.use(bodyParser.json());
    this.app.disable('x-powered-by');
  }

  private errorHandler() {
    // catch 404 and forward to error handler
    this.app.use((_req: Request, _res: Response, next: NextFunction) => {
      const err = new Error('Resource does not exist');
      // err.status = 404;
      next(err);
    });

    if (!isProduction) {
      this.app.use((err, _req: Request, res: Response, _next: NextFunction) => {
        log(err.stack);
        res.status(err.status || 500).json({
          error: {
            message: err.message,
            error: err,
          },
          status: false,
        });
      });
    }

    this.app.use((err, _req: Request, res: Response, _next: NextFunction) => {
      return res.status(err.status || 500).json({
        error: {
          message: err.message,
          error: {},
        },
        status: false,
      });
    });
  }

  // private routes() {}

  private loadEventListeners() {
    LogisticsEmitter.addListener(EventType.SendWelcomeEmail, async (payload) =>
      // Send email here
      console.log(payload)
    );
  }
}

export default App;
