import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import Subscription from '../entity/Subscription';
import { ESubscriptionType } from '../../types/enums/ESubscriptionType';

export class SeedSubscription1592114644845 implements MigrationInterface {
  public async up(_queryRunner: QueryRunner): Promise<void> {
    const subRepo = getRepository(Subscription);

    const subscriptions = [
      {
        name: 'FREE',
        description: '',
        price: 0,
        subscriptionDuration: 3,
        type: ESubscriptionType.FREE,
      },
      {
        name: 'STANDARD',
        description: '',
        price: 20000,
        subscriptionDuration: 6,
        type: ESubscriptionType.STANDARD,
      },
      {
        name: 'PREMIUM',
        description: '',
        price: 40000,
        subscriptionDuration: 6,
        type: ESubscriptionType.PREMIUM,
      },
    ];

    const subs = subRepo.create(subscriptions);
    await subRepo.save(subs);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
