import { Response } from 'express';
import { pick } from 'lodash';

import ValidationHelper from '../../Utils/ValidationHelper';
import CustomError from '../../Utils/CustomError';
import { HttpStatus } from '../../types/enums/HttpStatus';

import RespUtil from '../../Utils/RespUtil';
import RidersService from './RidersService';

const util = new RespUtil();

export default class RidersController {
  static async onBoardPartnerRider(req, res: Response, _next) {
    const { validateRider } = ValidationHelper;
    const { partner } = req;

    try {
      const payload = pick(req.body, [
        'email',
        'password',
        'confirm_password',
        'mobile_no',
        'first_name',
        'last_name',
        'profile_image',
      ]);

      const { error, value } = validateRider().validate(payload);
      if (error) throw new CustomError(HttpStatus.BAD_REQUEST, error.message);

      const response = await RidersService.onBoardRiders(value, partner);

      util.setSuccess(200, 'Rider added successful!', response);
      return util.send(res);
    } catch ({ statusCode, message }) {
      return util.setError(statusCode || 400, message).send(res);
    }
  }

  // static async getPartnerRiders(req: Request, res: Response, _next) {}

  // static async updatePartnerRider(req, res, next) {}
  // static async getPartnerRidersById(req, res, next) {}
}
