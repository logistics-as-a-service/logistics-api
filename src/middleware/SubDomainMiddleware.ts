import _ from 'lodash';

import ResUtil from '../Utils/RespUtil';
import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../types/enums/HttpStatus';
import { getPartnerRepository } from '../database/repository/index';

const util = new ResUtil();

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subdomain = String(req.headers['X-Subdomain']);
    if (!subdomain) return next();

    const { findSubDomain } = getPartnerRepository();
    const partner = await findSubDomain(subdomain);

    Object.assign(req, { partner });

    next();
  } catch ({ statusCode, message }) {
    return util.setError(statusCode || HttpStatus.BAD_REQUEST, message).send(res);
  }
};
