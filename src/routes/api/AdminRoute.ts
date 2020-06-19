import { Router } from 'express';
import Auth from '../../middleware/AuthMiddleware';

import AdminController from '../../modules/AdminModule/AdminController';
import { MustBeAdmin } from '../../middleware/PermissionMiddleware';

const router = Router();

router.post('/admin', [Auth, MustBeAdmin], AdminController.addAdmin);

export default router;
