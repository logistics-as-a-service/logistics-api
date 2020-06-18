import { Router } from 'express';
import Auth from '../../middleware/AuthMiddleware';
import { CanDisableUser } from '../../middleware/PermissionMiddleware';

import UserController from '../../modules/UserModule/UserController';

const router = Router();

router.put('/user/:user_id/disable', [Auth, CanDisableUser], UserController.disableUser);

export default router;
