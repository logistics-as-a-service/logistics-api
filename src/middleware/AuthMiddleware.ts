import passport from 'passport';
import _ from 'lodash';

import ResUtil from '../Utils/RespUtil';
import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../types/enums/HttpStatus';

const util = new ResUtil();

export default (req: Request, res: Response, next: NextFunction) =>
  passport.authenticate('jwt', { session: false }, (error, user, info) => {
    if (_.isUndefined(info) && !error) {
      req.user = user;
      return next();
    }

    if (error)
      return util
        .setError(
          HttpStatus.UNAUTHORIZED,
          error.message || error || 'Authentication error, please login again!'
        )
        .send(res);

    switch (info.name) {
      case 'TokenExpiredError':
        return util.setError(HttpStatus.UNAUTHORIZED, 'Authentication token expired!').send(res);
      case 'JsonWebTokenError':
        return util.setError(HttpStatus.UNAUTHORIZED, 'Invalid Authentication token!').send(res);
      case 'Error':
        return util.setError(HttpStatus.UNAUTHORIZED, info.message).send(res);
    }
  })(req, res, next);
