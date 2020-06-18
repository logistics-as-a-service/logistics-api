import { Router } from 'express';

import Auth from '../../middleware/AuthMiddleware';
import AuthController from '../../modules/AuthModule/AuthController';

const router = Router();

router.post('/auth/login', AuthController.login);

router.post('/auth/refresh_token', AuthController.refreshToken);
router.post('/auth/update_password', Auth, AuthController.updatePassword);

router.post('/auth/reset_password', AuthController.generateResetPasswordLink);
router.post('/auth/reset/:reset_token', AuthController.resetPassword);

export default router;
