import { Router } from 'express';

import Auth from '../../middleware/AuthMiddleware';
import MustBeAdmin from '../../middleware/AdminMiddleware';

import SubscriptionCtl from '../../modules/SubModule/SubController';

const router = Router();

router.get('/subscriptions', SubscriptionCtl.getSubscriptions);

router.put('/subscription/:subscription', [Auth, MustBeAdmin], SubscriptionCtl.updateSubscription);

router.post('/subscription', [Auth, MustBeAdmin], SubscriptionCtl.createSub);

export default router;
