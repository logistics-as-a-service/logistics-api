import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';
import User from './User';

@Entity({ name: 'admin' })
export default class Admin extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;
}
