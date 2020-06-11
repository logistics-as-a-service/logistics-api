import { Entity, BaseEntity, Column, JoinColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import Partner from './Partner';

@Entity({ name: 'partner_contacts' })
export default class PartnerContact extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Partner, (partner) => partner.contacts)
  @JoinColumn({ name: 'partner_id' })
  partner: Partner;

  @Column({ name: 'mobile_no' })
  mobileNo: string;
}
