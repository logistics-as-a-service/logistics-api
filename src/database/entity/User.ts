import {
  Entity,
  BaseEntity,
  Column,
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import * as ip from 'ip';
import bcrypt from 'bcrypt';
import { EUserType } from '../../types/enums/EUserType';
import Utility from '../../Utils/Utility';
import Rider from './Riders';
import Partner from './Partner';
import Customer from './Customer';
import Admin from './Admin';
import { uuid } from '../../Utils/uuid';

@Entity({ name: 'users' })
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 100, unique: true })
  email: string;

  @Column({ name: 'mobile_no', length: 100, nullable: true })
  mobileNo: string;

  @Column({ type: 'integer', name: 'user_type' })
  userType: EUserType;

  @Column()
  password: string;

  @Column({ name: 'last_login_ip' })
  lastLoginIp?: string;

  @Column({ name: 'last_login_date' })
  lastLoginDate: Date;

  @Column({ name: 'is_disabled', default: false })
  isDisabled: boolean;

  @Column({ name: 'reset_token', nullable: true })
  resetToken: string;

  @Column({ name: 'verification_token', nullable: true })
  verificationToken: string;

  @Column({ name: 'reset_expires', type: 'integer', nullable: true })
  resetExpires: number;

  @Column({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  // ::::::::::: DON'T TOUCH ::::::::: //
  @OneToOne(() => Partner, (partner) => partner.user, { eager: true })
  partner: Partner;

  @OneToOne(() => Customer, (customer) => customer.user, { eager: true })
  customer: Customer;

  @OneToOne(() => Admin, (admin) => admin.user, { eager: true })
  admin: Admin;

  @OneToOne(() => Rider, (rider) => rider.user, { eager: true })
  rider: Rider;

  // ::::::::::: END DON'T TOUCH ::::::::: //

  @BeforeInsert()
  updateDatesOnInsert() {
    this.lastLoginIp = ip.address();
    this.verificationToken = uuid();

    this.lastLoginDate = new Date();
    this.createdAt = new Date();
    this.updatedAt = new Date();

    this.encryptPassword();
  }

  @BeforeUpdate()
  updateDatesOnUpdate() {
    delete this.rider;
    delete this.partner;
    delete this.customer;
    delete this.admin;

    this.updatedAt = new Date();
  }

  private encryptPassword() {
    try {
      const saltRounds = bcrypt.genSaltSync(10);
      this.password = bcrypt.hashSync(this.password, saltRounds);

      this.mobileNo = Utility.formatPhoneNumber(this.mobileNo);
    } catch ({ message }) {
      throw new Error(message);
    }
  }

  validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
