import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ESubscriptionType } from '../../types/enums/ESubscriptionType';

@Entity({ name: 'subscriptions' })
export default class Subscription extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ type: 'text' })
  description: string;

  // @Column({ type: 'money' })
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column({ name: 'subscription_type_duration', type: 'integer' })
  subscriptionDuration: number;

  @Column({ nullable: false })
  type: ESubscriptionType;
}
