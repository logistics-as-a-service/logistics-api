import { Router } from 'express';
import AuthRoute from './AuthRoute';

const routes = Router();

routes.use('/', AuthRoute);

export default routes;
