import {
  Entity,
  BaseEntity,
  Column,
  BeforeInsert,
  BeforeUpdate,
  JoinColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Subscription from './Subscription';
import User from './User';
import State from './State';
import PartnerContact from './PartnerContact';
import Rider from './Riders';
import Order from './Order';

@Entity({ name: 'partners' })
export default class Partner extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'full_name', nullable: false })
  fullName: string;

  @Column({ name: 'company_name', nullable: false })
  companyName: string;

  @Column({ name: 'business_address', nullable: false })
  businessAddress: string;

  @Column({ name: 'business_email', nullable: false })
  businessEmail: string;

  @Column({ name: 'banner_url', nullable: true })
  bannerUrl: string;

  @Column({ name: 'logo_url', nullable: true })
  logoUrl: string;

  @Column({ name: 'facebook_url', nullable: true })
  facebookUrl: string;

  @Column({ name: 'instagram_url', nullable: true })
  instagramUrl: string;

  @Column({ name: 'linkedin_url', nullable: true })
  linkedinUrl: string;

  @Column({ name: 'website_url', nullable: true })
  websiteUrl: string;

  @Column({ name: 'sub_domain', nullable: false })
  subdomain: string;

  @Column({ nullable: false })
  domain: string;
  /*
  @Column({ name: 'delivery_payment_type', nullable: false })
  deliveryPaymentType: EDeliveryPaymentType;
*/
  @ManyToOne(() => Subscription)
  @JoinColumn({ name: 'subscription_id' })
  subscription: Subscription;

  @Column({ name: 'subscription_date' })
  subscriptionDate: Date;

  @Column({ name: 'subscription_expire_date' })
  subscriptionExpireDate: Date;

  @OneToOne(() => State)
  @JoinColumn({ name: 'state_id' })
  state: State;

  @OneToMany(() => PartnerContact, (contact) => contact.partner)
  contacts: PartnerContact[];

  @OneToMany(() => Rider, (rider) => rider.partner)
  riders: Rider[];

  @OneToMany(() => Order, (order) => order.partner)
  orders: Order[];

  @Column({ name: 'bank_acct_no', nullable: false })
  bankAcctNo: string;

  @Column({ name: 'bank_name', nullable: false })
  bankName: string;

  @Column({ name: 'bank_acct_name', nullable: true })
  bankAcctName: string;

  @Column({ name: 'paystack_pub_key', nullable: true })
  paystackPubKey: string;

  @Column({ name: 'paystack_sec_key', nullable: true })
  paystackSecKey: string;

  @Column({ name: 'flw_pub_key', nullable: true })
  flwPubKey: string;

  @Column({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  updateDatesOnInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();

    this.calSubExpireDate();
  }

  @BeforeUpdate()
  updateDatesOnUpdate() {
    this.updatedAt = new Date();
  }

  private calSubExpireDate() {
    this.subscriptionDate = new Date();
  }
}
