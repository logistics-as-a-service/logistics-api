import { Request, Response } from 'express';
import camelCase from 'camelcase-keys';
import { pick } from 'lodash';

import SubService from './SubService';
import RespUtil from '../../Utils/RespUtil';
import ValidationHelper from '../../Utils/ValidationHelper';

const util = new RespUtil();

/**
 * Subscription Controller
 */
export default class SubController {
  /**
   * Create Subscriptions
   */
  static async createSub(req: Request, res: Response, _next) {
    const { validateSub } = ValidationHelper;

    try {
      const payload = pick(req.body, [
        'name',
        'description',
        'price',
        'subscription_duration',
        'type',
      ]);

      const { error, value } = validateSub().validate(payload);
      if (error) throw new Error(error.message);

      const subscription = await SubService.createSubcription(camelCase(value));

      util.setSuccess(200, 'Successful!', subscription);
      return util.send(res);
    } catch ({ statusCode, message }) {
      return util.setError(statusCode || 400, message).send(res);
    }
  }

  /**
   * Get all Enabled Subscription
   */
  static async getSubscriptions(req: Request, res: Response, _next) {
    const { fetchType } = req.query;

    try {
      const subscriptions =
        fetchType === 'all'
          ? await SubService.allSubscription()
          : await SubService.getEnabledSubs();

      util.setSuccess(200, 'Successful!', subscriptions);
      return util.send(res);
    } catch ({ statusCode, message }) {
      return util.setError(statusCode || 400, message).send(res);
    }
  }

  /**
   * Update Subscription
   */
  static async updateSubscription(req: Request, res: Response, _next) {
    const { subscription } = req.params;
    const { validateSubUpdate } = ValidationHelper;

    try {
      const sub = await SubService.getSubscription(subscription);

      const payload = pick(req.body, [
        'name',
        'description',
        'price',
        'subscription_duration',
        'type',
        'is_disabled',
      ]);

      const { error, value } = validateSubUpdate().validate(payload);
      if (error) throw new Error(error.message);

      await SubService.updateSubcription(sub, camelCase(value));

      util.setSuccess(200, 'Subscription update successful!', {});
      return util.send(res);
    } catch ({ statusCode, message }) {
      return util.setError(statusCode || 400, message).send(res);
    }
  }
}
