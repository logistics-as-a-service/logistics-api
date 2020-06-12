import { Router } from 'express';
import Auth from '../../middleware/AuthMiddleware';

import AdminController from '../../modules/AdminModule/AdminController';

const router = Router();

router.post('/admin/create', Auth, AdminController.addAdmin);

export default router;
