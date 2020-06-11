import {
  Entity,
  BaseEntity,
  Column,
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as ip from 'ip';
import { EUserType } from '../../types/enums/EUserType';

@Entity({ name: 'users' })
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'username', nullable: false, length: 100, unique: true })
  username: string;

  @Column({ name: 'mobile_no', length: 100, nullable: false })
  mobileNo: string;

  @Column({ type: 'integer', name: 'user_type' })
  userType: EUserType;

  @Column()
  password: string;

  @Column({ name: 'last_login_ip' })
  lastLoginIp?: string;

  @Column({ name: 'last_login_date' })
  lastLoginDate: Date;

  @Column({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  updateDatesOnInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.lastLoginIp = ip.address();
  }

  @BeforeUpdate()
  updateDatesOnUpdate() {
    this.updatedAt = new Date();
  }
}
