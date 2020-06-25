import {Response, NextFunction } from 'express';
import {pick} from 'lodash';
import RespUtil from '../../Utils/RespUtil';
import {HttpStatus} from '../../types/enums/HttpStatus';
import ValidationHelper from '../../Utils/ValidationHelper';
import CustomError from '../../Utils/CustomError';
import {getDeliverySettingsRepository} from '../../database/repository';

const util = new RespUtil();

export default class DeliverySettingsController {

    static async createNewDeliverySettings(req, res: Response, _next: NextFunction) {
        try {

            const { user } = req;

            const payload = pick(req.body,[
                'lower_bound',
                'upper_bound',
                'cost'
            ]);
            
            const {error} = ValidationHelper.validateDeliverySettings().validate(payload);

            if(error) {
                throw new CustomError(HttpStatus.BAD_REQUEST, error.message);
            }

            const {lower_bound, upper_bound} = payload;
            if(upper_bound <= lower_bound) throw new CustomError(HttpStatus.BAD_REQUEST, 'upper bound must be greater than lower bound');

            const deliverySettingsRepo = getDeliverySettingsRepository();

            // This method checks if the lower or upper bound already exist for this partner
            await deliverySettingsRepo.findByLowerBoundAndPartner(payload.lower_bound, user.id);

            const deliverySettings = deliverySettingsRepo.create();
            deliverySettings.lowerBound = payload.lower_bound;
            deliverySettings.upperBound = payload.upper_bound;
            deliverySettings.cost = payload.cost;
            deliverySettings.partner = user;
            deliverySettings.hasInfiniteUpperBound = false;

            const response = await deliverySettingsRepo.save(deliverySettings);

            util.setSuccess(200, 'Delivery Settings created successfully', response);
            return util.send(res);
        } catch ({ statusCode, message }) {
            return util.setError(statusCode || HttpStatus.BAD_REQUEST, message).send(res);
        
        }
    }

    static async updateDeliverySettings(req, res: Response, _next: NextFunction) {
        try {

            const { user } = req;

            const payload = pick(req.body,[
                'lower_bound',
                'upper_bound',
                'cost'
            ]);
            
            const {error} = ValidationHelper.validateDeliverySettings().validate(payload);

            if(error) {
                throw new CustomError(HttpStatus.BAD_REQUEST, error.message);
            }

            const {lower_bound, upper_bound} = payload;
            if(upper_bound <= lower_bound) throw new CustomError(HttpStatus.BAD_REQUEST, 'upper bound must be greater than lower bound');

            const deliverySettingsRepo = getDeliverySettingsRepository();

            const deliverySettings = await deliverySettingsRepo.findByIdAndPartner(req.params.id, user.id);
            
            // This method checks if the lower or upper bound already exist for this partner
            await deliverySettingsRepo.findByIdAndLowerBoundAndPartner(deliverySettings.id,payload.lower_bound, user.id);

            deliverySettings.lowerBound = payload.lower_bound;
            deliverySettings.upperBound = payload.upper_bound;
            deliverySettings.cost = payload.cost;

            const response = await deliverySettingsRepo.save(deliverySettings);

            util.setSuccess(200, 'Delivery Settings updated successfully', response);
            return util.send(res);
        } catch ({ statusCode, message }) {
            return util.setError(statusCode || HttpStatus.BAD_REQUEST, message).send(res);
        
        }
    }
}