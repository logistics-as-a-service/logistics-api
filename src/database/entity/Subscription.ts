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

  @Column({ type: 'money' })
  price: number;

  @Column({ nullable: false })
  type: ESubscriptionType;
}
