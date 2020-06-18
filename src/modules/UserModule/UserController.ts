import { Response, NextFunction } from 'express';
import RespUtil from '../../Utils/RespUtil';
import { getUserRepository } from '../../database/repository';
import { HttpStatus } from '../../types/enums/HttpStatus';

const util = new RespUtil();

export default class UserController {
  static async disableUser(req, res: Response, _next: NextFunction) {
    const { user_id } = req.params;
    try {
      const userRepo = getUserRepository();

      await userRepo.findOneOrFail({ where: { id: user_id } });

      await userRepo.update(user_id, { isDisabled: true });

      util.setSuccess(200, 'Update successful!', {});
      return util.send(res);
    } catch ({ statusCode, message }) {
      return util.setError(statusCode || HttpStatus.BAD_REQUEST, message).send(res);
    }
  }
}
