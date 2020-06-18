import _ from 'lodash';

import ResUtil from '../Utils/RespUtil';
import { Response, NextFunction } from 'express';
import { HttpStatus } from '../types/enums/HttpStatus';
import CustomError from '../Utils/CustomError';
import User from '../database/entity/User';

const util = new ResUtil();

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
