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
    try {
      const payload = PartnerController.validateRequest(req);

      const partner = new Partner();

      const {
        email,
        password,
        confirm_password,
        contacts,
        state_id: state,
        city_id: city,
        ...data
      } = payload;

      const user: Partial<User> = {
        email,
        password,
        mobileNo: contacts[0].mobile_no,
        userType: EUserType.PARTNER,
      };

      Object.assign(partner, {
        user,
        contacts: camelCase(contacts),
        state,
        city,
        ...camelCase(data),
      });

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

  static async updatePartner(req: Request, res: Response, _next: NextFunction) {
    const { partner_id } = req.params;

    try {
      const partnerRepo = getRepository(Partner);
      const partner = await partnerRepo.findOneOrFail({ where: { id: partner_id } });

      const payload = PartnerController.validateRequest(req);

      const { contacts, subscription, state_id: state, city_id: city, ...data } = payload;

      Object.assign(partner, {
        // contacts: contacts && contacts.length > 0 ? camelCase(contacts) : partner.contacts,
        state: state ? state : partner.state,
        city: city ? city : partner.city,
        ...camelCase(data),
      });

      await partnerRepo.update(partner_id, partner);

      // return partnerRepo.findOne(partner_id);
      util.setSuccess(200, 'Register successful!', {});
      return util.send(res);
    } catch ({ statusCode, message }) {
      return util.setError(statusCode || HttpStatus.BAD_REQUEST, message).send(res);
    }
  }

  /**
   * Validate Partner request
   * @param req Request
   */
  static validateRequest(req: Request) {
    const { validatePartner, validatePartnerUpdate } = ValidationHelper;
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

    const fieldsValidator = req.method === 'PUT' ? validatePartnerUpdate() : validatePartner();

    const { error, value } = fieldsValidator.validate(payload);
    if (error) throw new CustomError(HttpStatus.BAD_REQUEST, error.message);

    return value;
  }
}
