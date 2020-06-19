import { Response, NextFunction } from 'express';
import { pick } from 'lodash';

import CustomError from '../../Utils/CustomError';
import RespUtil from '../../Utils/RespUtil';
import ValidationHelper from '../../Utils/ValidationHelper';
import { getAdminRepository } from '../../database/repository/index';

const util = new RespUtil();

export default class AdminController {
  /**
   *  Rest API to add other admin
   */
  static async addAdmin(req, res: Response, _next: NextFunction) {
    const [{ validateUser }, { createOrFail }] = [ValidationHelper, getAdminRepository()];

    try {
      const payload = pick(req.body, [
        'first_name',
        'last_name',
        'email',
        'password',
        'confirm_password',
        'mobile_no',
      ]);

      const { error } = validateUser().validate(payload);
      if (error) throw new CustomError(400, error.message);

      const admin = await createOrFail(payload);

      // TODO: email notification

      util.setSuccess(200, 'Admin added successful!', admin);
      return util.send(res);
      //
    } catch ({ statusCode, message }) {
      return util.setError(statusCode || 400, message).send(res);
    }
  }
}
