import { Response, NextFunction } from 'express';
import RespUtil from '../../Utils/RespUtil';
import User from '../../database/entity/User';
import { getUserRepository } from '../../database/repository';
import { HttpStatus } from '../../types/enums/HttpStatus';

const util = new RespUtil();

export default class UserController {

    static async disableUser(req, res: Response, _next: NextFunction){
        const { user_id } = req.params;
        try{
            const user: User = await getUserRepository().findOneOrFail({where: {id: user_id}});
            user.isDisabled = true;
            await getUserRepository().update(user_id, user);

            util.setSuccess(200, 'Update successful!', {});
            return util.send(res);
        }catch ({ statusCode, message }) {
            return util.setError(statusCode || HttpStatus.BAD_REQUEST, message).send(res);
        }
        


    }

}