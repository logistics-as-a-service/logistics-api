import { Request, Response, NextFunction } from 'express';
import { pick } from 'lodash';
import * as ip from 'ip';
import config from 'config';
import jwt from 'jsonwebtoken';

import AuthService from './AuthService';
import ValidationHelper from '../../Utils/ValidationHelper';
import CustomError from '../../Utils/CustomError';
import RespUtil from '../../Utils/RespUtil';
import { getUserRepository } from '../../database/repository';
import { uuid } from '../../Utils/uuid';
import { LogisticsEmitter, EventType } from '../../Utils/Emittery';
import Utility from '../../Utils/Utility';

const util = new RespUtil();

const resetExpires: number = config.get('auth.resetPasswordExp');
const host = config.get('general.fontendUrl');

export default class AuthController {
  /**
   * User Login
   */
  static async login(req: Request, res: Response, _next: NextFunction) {
    const { validateLogin } = ValidationHelper;
    const userRepo = getUserRepository();

    try {
      const payload = pick(req.body, ['email', 'password']);

      const { error } = validateLogin().validate(payload);
      if (error) throw new CustomError(400, error.message);

      const user = await userRepo.validateCred(payload.email, payload.password);
      userRepo.update({ id: user.id }, { lastLoginIp: ip.address() });

      const response = await AuthService.getAuthToken(user);

      util.setSuccess(200, 'Login successful!', response);
      return util.send(res);
    } catch ({ statusCode, message }) {
      return util.setError(statusCode || 400, message).send(res);
    }
  }

  /**
   * Refresh token
   */
  static async refreshToken(req: Request, res: Response, _next: NextFunction) {
    const { refresh_token } = req.body;

    try {
      if (!refresh_token) {
        throw new CustomError(400, 'Refresh token is required!');
      }

      const decodedToken: any = jwt.verify(refresh_token, config.get('auth.refreshSecret'));
      // check the expiration date
      if (Date.now() >= decodedToken.exp * 1000)
        throw new CustomError(401, 'Your refresh token has expired, please login!');

      const payload = await AuthService.getAuthToken(decodedToken.user);

      util.setSuccess(200, 'referesh successful!', payload);
      return util.send(res);
    } catch (error) {
      return util.setError(error.statusCode || 400, error.message).send(res);
    }
  }

  /**
   * Reset password
   */
  static async generateResetPasswordLink(req: Request, res: Response, _next: NextFunction) {
    const userRepo = getUserRepository();

    try {
      const { email } = pick(req.body, ['email']);
      if (!email) throw new CustomError(404, 'Email address is required!');

      const msg = `If an account exists for ${email}, you will receive password reset instructions.`;

      const user = await userRepo.findOne({ email });
      if (!user) throw new CustomError(404, msg);

      const resetToken = uuid();

      await userRepo.update(user.id, { resetToken, resetExpires });

      const link = `http://${host}/auth/reset/${resetToken}`;

      LogisticsEmitter.emit({ payload: { link, ...user }, type: EventType.SendResetPassword });

      util.setSuccess(200, msg, {});
      return util.send(res);
    } catch (error) {
      return util.setError(error.statusCode || 400, error.message).send(res);
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(req: Request, res: Response, _next: NextFunction) {
    const { reset_token } = req.params;
    const currentTime = Math.floor(Date.now() / 1000);

    const [{ validatePasswordOnly }, { encryptPassword }] = [ValidationHelper, Utility];
    const userRepo = getUserRepository();

    try {
      const user = await userRepo.findOne({ resetToken: reset_token });

      if (user && user.resetExpires > currentTime) {
        const payload = pick(req.body, ['password', 'confirm_password']);

        const { error, value } = validatePasswordOnly().validate(payload);
        if (error) throw new CustomError(400, error.message);

        const password = encryptPassword(value.password);

        await userRepo.update(user.id, { password, resetToken: '', resetExpires: 0 });

        util.setSuccess(200, 'Password reset successfully, please login to proceed!', {});
        return util.send(res);
      }

      throw new Error('Password reset token is invalid or has expired');
    } catch (error) {
      return util.setError(error.statusCode || 400, error.message).send(res);
    }
  }

  static async updatePassword(req, res: Response, _next: NextFunction) {
    const { user } = req;
    const userRepo = getUserRepository();
    const [{ updatePassword }, { encryptPassword }] = [ValidationHelper, Utility];

    try {
      const payload = pick(req.body, ['current_password', 'password', 'confirm_password']);

      const { error, value } = updatePassword().validate(payload);
      if (error) throw new CustomError(400, error.message);

      const check = await user.validatePassword(payload.current_password);
      if (!check) throw new CustomError(400, 'Current password did not match with our record!');

      user.password = encryptPassword(value.password);

      await userRepo.update({ id: user.id }, user);

      util.setSuccess(200, 'Password update successfully!', {});
      return util.send(res);
    } catch (error) {
      return util.setError(error.statusCode || 400, error.message).send(res);
    }
  }
}
