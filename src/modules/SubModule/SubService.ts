import moment from 'moment';

import { getRepository } from 'typeorm';
import Subscription from '../../database/entity/Subscription';
import { ESubscriptionType } from '../../types/enums/ESubscriptionType';

export default class SubService {
  static async createSubcription(payload: any): Promise<Subscription> {
    let type: any = ESubscriptionType.FREE;
    const subRepo = getRepository(Subscription);

    try {
      const subscription = new Subscription();

      if (payload.type) {
        type = ESubscriptionType[payload.type.toUpperCase()];
        if (!type)
          throw new Error(`${payload.type.toUpperCase()} Subscription type does not exist!`);
      }

      Object.assign(subscription, { ...payload, type });

      const sub = subRepo.create(subscription);
      return subRepo.save(sub);
    } catch ({ message }) {
      throw new Error(message);
    }
  }

  // fetch enabled Subscriptions
  static async getEnabledSubs(): Promise<Subscription[]> {
    const subRepo = getRepository(Subscription);
    return subRepo.find({ where: { isDisabled: false } });
  }

  // Fetch all subscriptions
  static async allSubscription(): Promise<Subscription[]> {
    const subRepo = getRepository(Subscription);
    return subRepo.find();
  }

  // disabled subscription
  static async disableSubcription(sub: Subscription): Promise<boolean> {
    const subRepo = getRepository(Subscription);

    const isUpdated = await subRepo.update(sub.id, { isDisabled: true });
    if (isUpdated.affected) return true;
    return false;
  }

  // Update subscription
  static async updateSubcription(sub: Subscription, payload: any): Promise<boolean> {
    const subRepo = getRepository(Subscription);
    let type: any = sub.type;

    if (payload.type) {
      type = ESubscriptionType[payload.type.toUpperCase()];
      console.log(type);
      if (!type) throw new Error(`${payload.type} Subscription type assigned does not exist!`);
    }
    Object.assign(payload, { type });

    const isUpdated = await subRepo.update(sub.id, { ...payload });
    if (isUpdated.affected) return true;

    throw new Error('Error occuring while updating subscription');
  }

  // get subscription by ID
  static async getSubscription(id: any): Promise<Subscription> {
    const subRepo = getRepository(Subscription);

    return subRepo.findOneOrFail(id);
  }

  /**
   * calc Subscription Expired Date
   * @param subscription subscription ID
   */
  static async calSubsription(subscription: any): Promise<Date[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const subRepo = getRepository(Subscription);

        const sub = await subRepo.findOne(subscription);
        const currentDate = moment(new Date());

        const start = currentDate.toDate();
        const expired = currentDate.add(sub?.subscriptionDuration, 'months').toDate();

        resolve([start, expired]);
      } catch ({ message }) {
        reject(new Error(message));
      }
    });
  }

  // cancel partner subscription and setup refund
}
