import { Router } from 'express';

import AuthRoute from './AuthRoute';
import AdminRoute from './AdminRoute';
import PartnerRoute from './PartnerRoute';
import SubRoute from './SubRoute';
import StateRoute from './StateRoute';
import UserRoute from './UserRoute';

const routes = Router();

routes.use('/', AuthRoute);
routes.use('/', AdminRoute);
routes.use('/', PartnerRoute);
routes.use('/', StateRoute);
routes.use('/', SubRoute);
routes.use('/', UserRoute);

export default routes;
