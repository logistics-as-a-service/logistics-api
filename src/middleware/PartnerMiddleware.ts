import ResUtil from '../Utils/RespUtil';
import { Response, NextFunction } from 'express';
import { HttpStatus } from '../types/enums/HttpStatus';
import { getPartnerRepository } from '../database/repository/index';
import CustomError from '../Utils/CustomError';
import { EUserType } from '../types/enums/EUserType';

const util = new ResUtil();
// { [key: string]: string; }
export default async (req, res: Response, next: NextFunction) => {
  const approvedUsers = [EUserType.PARTNER, EUserType.ADMIN];
  const { partner: partnerId } = req.params;
  const user = req.user;

  try {
    if (user === undefined) throw new Error('Add Authentication middleware first');

    if (!approvedUsers.includes(user.userType)) {
      throw new CustomError(
        HttpStatus.FORBIDDEN,
        'You must be a registered and active partner to perform this action'
      );
    }

    const partnerRepo = getPartnerRepository();
    const currentPartner = await partnerRepo.findOneOrFail({
      where: { id: partnerId },
      relations: ['user'],
    });

    const owner = currentPartner.isOwnBy(user);
    delete currentPartner.user;

    Object.assign(req, { partner: currentPartner });

    if (user.userType === EUserType.ADMIN) return next();
    if (!owner) {
      throw new CustomError(
        HttpStatus.BAD_REQUEST,
        'You are not authorized to manage this resources, consult admin'
      );
    }

    next();
  } catch ({ statusCode, message }) {
    return util.setError(statusCode || HttpStatus.BAD_REQUEST, message).send(res);
  }
};
