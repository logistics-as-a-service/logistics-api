import { Response, NextFunction } from 'express';
import RespUtil from '../../Utils/RespUtil';
import { getUserRepository } from '../../database/repository';
import { HttpStatus } from '../../types/enums/HttpStatus';
import UserResponse from '../../types/responses/UserResponse';

const util = new RespUtil();

export default class UserController {
  static async disableUser(req, res: Response, _next: NextFunction) {
    const { user_id } = req.params;
    try {
      const userRepo = getUserRepository();

      const user = await userRepo.findOneOrFail({ where: { id: user_id } });
      const userStatus = user.isDisabled
        ? { message: 'enabled', status: false }
        : { message: 'disabled', status: true };

      await userRepo.update(user_id, { isDisabled: userStatus.status });

      util.setSuccess(200, `User ${userStatus.message} successful!`, {});
      return util.send(res);
    } catch ({ statusCode, message }) {
      return util.setError(statusCode || HttpStatus.BAD_REQUEST, message).send(res);
    }
  }

  static async getProfile(req, res: Response, _next: NextFunction) {
    const { user } = req;
    try {
      if (user.partner && user.partner.riders) {
        delete user.partner.riders;
      }

      util.setSuccess(200, 'successful!', new UserResponse(user));
      return util.send(res);
    } catch ({ message }) {
      return util.setError(HttpStatus.BAD_REQUEST, message).send(res);
    }
  }
}
