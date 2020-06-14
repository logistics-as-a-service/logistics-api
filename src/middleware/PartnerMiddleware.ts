import _ from 'lodash';

import ResUtil from '../Utils/RespUtil';
import { Response, NextFunction } from 'express';
import { HttpStatus } from '../types/enums/HttpStatus';
import { getPartnerRepository } from '../database/repository/index';
import CustomError from '../Utils/CustomError';
import { EUserType } from '../types/enums/EUserType';

const util = new ResUtil();
// { [key: string]: string; }
export default async (req, res: Response, next: NextFunction) => {
  const { partner_id } = req.params;
  const user = req.user;

  try {
    if (user === undefined) throw new Error('Add Authentication middleware first');

    const partnerRepo = getPartnerRepository();
    const partner = await partnerRepo.findOneOrFail({
      where: { id: partner_id },
      relations: ['user'],
    });

    const userId = partner.user.id;
    delete partner.user;

    Object.assign(req, { partner });

    if (user.userType === EUserType.ADMIN) return next();
    if (userId !== user.id) {
      throw new CustomError(
        HttpStatus.FORBIDDEN,
        'You are not authorized to manage this resources, consult admin'
      );
    }

    next();
  } catch ({ statusCode, message }) {
    return util.setError(statusCode || HttpStatus.BAD_REQUEST, message).send(res);
  }
};
