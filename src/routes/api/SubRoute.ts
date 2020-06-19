import { Router } from 'express';

import Auth from '../../middleware/AuthMiddleware';
import SubscriptionCtl from '../../modules/SubModule/SubController';

import { MustBeAdmin } from '../../middleware/PermissionMiddleware';

const router = Router();

router.get('/subscriptions', SubscriptionCtl.getSubscriptions);

router.put(
  '/subscription/:subscription_id',
  [Auth, MustBeAdmin],
  SubscriptionCtl.updateSubscription
);

router.post('/subscription', [Auth, MustBeAdmin], SubscriptionCtl.createSub);

export default router;
