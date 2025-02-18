import { Router } from 'express';

import AuthRoute from './AuthRoute';
import AdminRoute from './AdminRoute';
import PartnerRoute from './PartnerRoute';
import SubRoute from './SubRoute';
import StateRoute from './StateRoute';
import UserRoute from './UserRoute';
import DeliverySettingsRoute from './DeliverySettingsRoute';

const routes = Router();

routes.use('/', AuthRoute);
routes.use('/', AdminRoute);
routes.use('/', StateRoute);
routes.use('/', SubRoute);
routes.use('/', UserRoute);
routes.use('/', PartnerRoute);
routes.use('/', DeliverySettingsRoute);

export default routes;
