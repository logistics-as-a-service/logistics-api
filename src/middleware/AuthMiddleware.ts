/* eslint-disable consistent-return */
/* eslint-disable default-case */
import passport from 'passport';
import _ from 'lodash';

import ResUtil from '../Utils/RespUtil';
import { Request, Response, NextFunction } from 'express';

const util = new ResUtil();

export default (req: Request, res: Response, next: NextFunction) =>
  passport.authenticate('jwt', { session: false }, (error, user, info) => {
    if (_.isUndefined(info) && !error) {
      req.user = user;
      return next();
    }

    if (error)
      return util
        .setError(401, error.message || error || 'Authentication error, please login again!')
        .send(res);

    switch (info.name) {
      case 'TokenExpiredError':
        return util.setError(401, 'Authentication token expired!').send(res);
      case 'JsonWebTokenError':
        return util.setError(401, 'Invalid Authentication token!').send(res);
      case 'Error':
        return util.setError(401, info.message).send(res);
    }
  })(req, res, next);
