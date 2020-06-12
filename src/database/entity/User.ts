import {
  Entity,
  BaseEntity,
  Column,
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as ip from 'ip';
import bcrypt from 'bcrypt';
import { EUserType } from '../../types/enums/EUserType';
import PhoneUtility from '../../Utils/PhoneUtility';

@Entity({ name: 'users' })
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 100, unique: true })
  email: string;

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
    this.lastLoginIp = ip.address();

    this.lastLoginDate = new Date();
    this.createdAt = new Date();
    this.updatedAt = new Date();

    this.encryptPassword();
  }

  @BeforeUpdate()
  updateDatesOnUpdate() {
    this.updatedAt = new Date();
  }

  private encryptPassword() {
    try {
      const saltRounds = bcrypt.genSaltSync(10);
      this.password = bcrypt.hashSync(this.password, saltRounds);

      this.mobileNo = PhoneUtility.formatPhoneNumber(this.mobileNo);
    } catch ({ mesage }) {
      throw new Error(mesage);
    }
  }
}
