import camelCase from 'camelcase-keys';
import { getRepository } from 'typeorm';

import Rider from '../../database/entity/Riders';
import User from '../../database/entity/User';
import { EUserType } from '../../types/enums/EUserType';
import Partner from '../../database/entity/Partner';

export default class RidersService {
  // OnBoard riders
  static async onBoardRiders(payload: any, partner: Partner): Promise<Rider> {
    try {
      const riderRepo = getRepository(Rider);

      const { email, mobileNo, password, ...data } = camelCase(payload);

      const rider = new Rider();
      const user: Partial<User> = { email, password, mobileNo, userType: EUserType.RIDER };

      Object.assign(rider, { ...data, partner: partner.id, user });

      const createRider = riderRepo.create(rider);
      return riderRepo.save(createRider);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async findById(riderId: string): Promise<Rider> {
    return getRepository(Rider).findOneOrFail(riderId, { relations: ['user'] });
  }

  static async updateRider(riderId: any, payload) {
    const riderRepo = getRepository(Rider);

    try {
      const rider = await riderRepo.findOneOrFail(riderId);
      // TODO: fix one-to-many update issues
      const { mobileNo, ...data } = camelCase(payload);
      Object.assign(rider, { ...data });

      await riderRepo.update(riderId, rider);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Update riders information
  // Assigning/Re-Assigning delivery orders to riders
  // retired riders
}
