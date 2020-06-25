import { Response, NextFunction } from 'express';
import camelCase from 'camelcase-keys';
import { pick } from 'lodash';

import ValidationHelper from '../../Utils/ValidationHelper';

import RespUtil from '../../Utils/RespUtil';
import RidersService from './RidersService';
import RiderResponse from '../../types/responses/RiderResponse';
import { streamFileToS3 } from '../../Utils/FileUploader';
import User from '../../database/entity/User';
import PartnerResponse from '../../types/responses/PartnerResponse';
import CustomError from '../../Utils/CustomError';
import { HttpStatus } from '../../types/enums/HttpStatus';

const util = new RespUtil();

export default class RidersController {
  static async onBoardRider(req, res: Response, _next) {
    const { validateRider } = ValidationHelper;
    const { partner, file } = req;

    try {
      if (!file) throw new Error('Upload Riders profile image is required');

      const payload = pick(req.body, [
        'email',
        'password',
        'confirm_password',
        'mobile_no',
        'first_name',
        'last_name',
      ]);

      const data = await validateRider().validateAsync(payload);

      const check = await User.findOne({ email: payload.email });
      if (check) throw new Error(`Rider with email: ${check.email}, record exist!`);

      // everything is clean, you can upload image
      const uploadedFile: any = await streamFileToS3(file.buffer, file.originalname);
      Object.assign(data, { ...camelCase(data), profileImage: uploadedFile.Location });

      const response = await RidersService.onBoardRiders(data, partner);
      response.sendVerificationMail();

      util.setSuccess(200, 'Rider added successful!', new RiderResponse(response));
      return util.send(res);
    } catch ({ statusCode, message }) {
      return util.setError(statusCode || 400, message).send(res);
    }
  }

  static async getRiders(req, res: Response, _next) {
    try {
      const response = new PartnerResponse(req.partner);

      util.setSuccess(200, 'successful!', response);
      return util.send(res);
    } catch ({ statusCode, message }) {
      return util.setError(statusCode || 400, message).send(res);
    }
  }

  static async getRidersById(req, res: Response, _next: NextFunction) {
    const { rider_id } = req.params;
    const { partner } = req;

    try {
      const check = partner.riders.filter((rider) => rider.id === rider_id)[0];
      if (!check) throw new CustomError(HttpStatus.NOT_FOUND, 'Rider not found!');

      const rider = await RidersService.findById(rider_id);

      util.setSuccess(200, 'successful!', new RiderResponse(rider));
      return util.send(res);
    } catch ({ statusCode, message }) {
      return util.setError(statusCode || 400, message).send(res);
    }
  }

  static async uploadRider(req, res: Response, _next: NextFunction) {
    const { validateUpdateRider } = ValidationHelper;
    const { rider_id } = req.params;
    const { partner } = req;

    try {
      const check = partner.riders.filter((rider) => rider.id === rider_id)[0];
      if (!check) throw new CustomError(HttpStatus.NOT_FOUND, 'Rider not found!');

      const payload = pick(req.body, [
        'first_name',
        'last_name',
        'mobile_no',
        'is_engaged',
        'is_retired',
      ]);
      const data = await validateUpdateRider().validateAsync(payload);

      await RidersService.updateRider(rider_id, data);

      util.setSuccess(200, 'Update successful!', {});
      return util.send(res);
    } catch ({ statusCode, message }) {
      return util.setError(statusCode || 400, message).send(res);
    }
  }
}
