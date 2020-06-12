import { Router } from 'express';

import AuthRoute from './AuthRoute';
import AdminRoute from './AdminRoute';

const routes = Router();

routes.use('/', AuthRoute);
routes.use('/', AdminRoute);

export default routes;
