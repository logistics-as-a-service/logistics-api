import _ from 'lodash';

import ResUtil from '../Utils/RespUtil';
import { Response, NextFunction } from 'express';
import { HttpStatus } from '../types/enums/HttpStatus';
import User from '../database/entity/User';
import { EUserType } from '../types/enums/EUserType';
import CustomError from '../Utils/CustomError';

const util = new ResUtil();
// { [key: string]: string; }
export default async (req, res: Response, next: NextFunction) => {
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
