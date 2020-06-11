import {
  JoinColumn,
  Column,
  Entity,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './User';

@Entity({ name: 'delivery_settings' })
export default class DeliverySettings extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: 'partner_id' })
  partner: User;

  @Column({ name: 'lower_bound', type: 'int' })
  lowerBound: number;

  @Column({ name: 'upper_bound', type: 'int' })
  upperBound: number;

  @Column({ type: 'money' })
  cost: number;

  @Column({ name: 'has_infinite_upper_bound', type: 'boolean' })
  hasInfiniteUpperBound: boolean;

  @Column({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  updateDatesOnInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  updateDatesOnUpdate() {
    this.updatedAt = new Date();
  }
}
