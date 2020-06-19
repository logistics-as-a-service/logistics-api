/**
 * Permission handles all permission that has to do with User
 *
 * - CanDisableUser - Admin can disabled any user while partner disable riders
 * - MustBeAdmin - Can manage admin, partner and subscrptions creation
 * - CanManagePartner - Create Partner, Update and Add Riders
 */
import _ from 'lodash';

import { Response, NextFunction } from 'express';

import { HttpStatus } from '../types/enums/HttpStatus';
import CustomError from '../Utils/CustomError';
import User from '../database/entity/User';
import ResUtil from '../Utils/RespUtil';
import { EUserType } from '../types/enums/EUserType';
import { getPartnerRepository } from '../database/repository/index';

const util = new ResUtil();

/**
 *  Can disable User
 */
export const CanDisableUser = async (req, res: Response, next: NextFunction) => {
  const { user_id } = req.params;
  const logginInUser: User = req.user;

  try {
    if (logginInUser === undefined) throw new Error('Add Authentication middleware first');

    const user: User = await User.findOneOrFail({ where: { id: user_id } });

    if (user.id === logginInUser.id) {
      throw new CustomError(HttpStatus.FORBIDDEN, 'You cannot disable your account, contact admin');
    }
    // if admin, move on
    if (logginInUser.admin) return next();

    // if partner, check if use to delete is admin
    if (!user.rider)
      throw new CustomError(
        HttpStatus.BAD_REQUEST,
        'The User you are trying to disable is not a Rider, check and try again!'
      );

    if (
      // check if nigga is partner and own the rider
      logginInUser.partner &&
      logginInUser.partner.riders.filter((rider) => rider.id === user.rider.id)[0]
    ) {
      return next();
    }

    throw new CustomError(
      HttpStatus.FORBIDDEN,
      'You are not authorized to manage this resources, consult admin'
    );
  } catch ({ statusCode, message }) {
    return util.setError(statusCode || HttpStatus.BAD_REQUEST, message).send(res);
  }
};

/**
 * Must be Admin
 */
export const MustBeAdmin = async (req, res: Response, next: NextFunction) => {
  const user: User = req.user;

  try {
    if (!user) throw new Error('Add Authentication middleware first');

    if (user.userType !== EUserType.ADMIN) {
      throw new CustomError(HttpStatus.UNAUTHORIZED, 'Access to this resources is denied');
    }

    next();
  } catch ({ statusCode, message }) {
    return util.setError(statusCode || HttpStatus.BAD_REQUEST, message).send(res);
  }
};

/**
 * Can Manage Partner
 */
export const CanManagePartner = async (req, res: Response, next: NextFunction) => {
  const approvedUsers = [EUserType.PARTNER, EUserType.ADMIN];
  const { partner_id: partnerId } = req.params;
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
