import camelCase from 'camelcase-keys';

import Rider from '../../database/entity/Riders';
import User from '../../database/entity/User';
import { EUserType } from '../../types/enums/EUserType';
import Partner from '../../database/entity/Partner';
import { getRepository } from 'typeorm';

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

  static async findById(riderId): Promise<Rider> {
    return getRepository(Rider).findOneOrFail(riderId, { relations: ['user'] });
  }

  // Update riders information
  // Assigning/Re-Assigning delivery orders to riders
  // retired riders
}
