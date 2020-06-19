import { Response } from 'express';
import { pick } from 'lodash';

import ValidationHelper from '../../Utils/ValidationHelper';
import CustomError from '../../Utils/CustomError';
import { HttpStatus } from '../../types/enums/HttpStatus';

import RespUtil from '../../Utils/RespUtil';
import RidersService from './RidersService';
import RiderResponse from '../../types/responses/RiderResponse';

const util = new RespUtil();

export default class RidersController {
  static async onBoardRider(req, res: Response, _next) {
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

  static async getRiders(req, res: Response, _next) {
    try {
      const response = new RiderResponse(req.partner);

      util.setSuccess(200, 'successful!', response);
      return util.send(res);
    } catch ({ statusCode, message }) {
      return util.setError(statusCode || 400, message).send(res);
    }
  }

  // static async updatePartnerRider(req, res, next) {}
  // static async getPartnerRidersById(req, res, next) {}
}
