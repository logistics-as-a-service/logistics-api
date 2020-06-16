import { Router } from 'express';

import AuthRoute from './AuthRoute';
import AdminRoute from './AdminRoute';
import PartnerRoute from './PartnerRoute';
import SubRoute from './SubRoute';
import StateRoute from './StateRoute';

const routes = Router();

routes.use('/', AuthRoute);
routes.use('/', AdminRoute);
routes.use('/', PartnerRoute);
routes.use('/', StateRoute);
routes.use('/', SubRoute);

export default routes;
