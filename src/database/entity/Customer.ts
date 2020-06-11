import {
  Entity,
  BaseEntity,
  Column,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import User from './User';
import Order from './Order';

@Entity({ name: 'customers' })
export default class Customer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @OneToMany(() => Order, (order) => order.customer, { eager: true })
  orders: Order[];
}
