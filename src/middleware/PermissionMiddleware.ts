import _ from 'lodash';

import ResUtil from '../Utils/RespUtil';
import { Response, NextFunction } from 'express';
import { HttpStatus } from '../types/enums/HttpStatus';
import { getUserRepository } from '../database/repository/index';
import CustomError from '../Utils/CustomError';
import { EUserType } from '../types/enums/EUserType';

const util = new ResUtil();
// { [key: string]: string; }
export const CanDisableUser = async (req, res: Response, next: NextFunction) => {
  const { user_id } = req.params;
  const logginInUser = req.user;

  try {
    if (logginInUser === undefined) throw new Error('Add Authentication middleware first');

    const userRepo = getUserRepository();
    const user = await userRepo.findOneOrFail({
      where: { id: user_id }
    });

    if(user.id === logginInUser.id){
        throw new CustomError(
            HttpStatus.FORBIDDEN,
            'You cannot disable your account, contact admin'
        );
    }

    if(logginInUser.userType === EUserType.ADMIN)
        return next();
    
    if(logginInUser.userType === EUserType.PARTNER && user.userType === EUserType.RIDER){
        // TODO: check if rider is tied to partner
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
