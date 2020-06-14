import { Request, Response, NextFunction } from 'express';
import { pick } from 'lodash';
import camelCase from 'camelcase-keys';

import ValidationHelper from '../../Utils/ValidationHelper';
import CustomError from '../../Utils/CustomError';
import { HttpStatus } from '../../types/enums/HttpStatus';
import RespUtil from '../../Utils/RespUtil';
import Partner from '../../database/entity/Partner';
import { EUserType } from '../../types/enums/EUserType';
import User from '../../database/entity/User';
import { getRepository } from 'typeorm';

const util = new RespUtil();
const PG_UNIQUE_CONSTRAINT_VIOLATION = '23505';

export default class PartnerController {
  /**
   * Endpoint for partner signup
   */
  static async registerPartner(req: Request, res: Response, _next: NextFunction) {
    const { validatePartner } = ValidationHelper;
    const payload = pick(req.body, [
      'email',
      'password',
      'confirm_password',
      'full_name',
      'company_name',
      'business_address',
      'business_email',
      'subdomain',
      'domain',
      'subscription',
      'contacts',
      'state_id',
      'city_id',
      'banner_url',
      'logo_url',
      'facebook_url',
      'instagram_url',
      'linkedin_url',
      'website_url',
    ]);

    try {
      const { error } = validatePartner().validate(payload);
      if (error) throw new CustomError(HttpStatus.BAD_REQUEST, error.message);

      const partner = new Partner();

      const { email, password, confirm_password, contacts, ...data } = payload;
      const user: Partial<User> = {
        email,
        password,
        mobileNo: contacts[0].mobile_no,
        userType: EUserType.PARTNER,
      };

      Object.assign(partner, { user, contacts: camelCase(contacts), ...camelCase(data) });

      const partnerRepo = getRepository(Partner);
      const partber = partnerRepo.create(partner);

      const response = await partnerRepo.save(partber);

      util.setSuccess(200, 'Register successful!', response);
      return util.send(res);
    } catch (error) {
      if (error && error.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
        return util.setError(HttpStatus.BAD_REQUEST, error.detail).send(res);
      }
      return util.setError(error.statusCode || HttpStatus.BAD_REQUEST, error.message).send(res);
    }
  }

  static async updatePartner(req: Request, _res: Response, _next: NextFunction) {
    const { partner_id } = req.params;
    console.log(partner_id);
  }
}
