import {
  Entity,
  BaseEntity,
  Column,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './User';
import Partner from './Partner';

@Entity({ name: 'riders' })
export default class Rider extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Partner, (partner) => partner.riders)
  @JoinColumn({ name: 'partner_id' })
  partner: Partner;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'profile_image', nullable: false })
  profileImage?: string;

  @Column({ name: 'is_engaged', type: 'boolean', default: false })
  isEngaged: boolean;

  @Column({ name: 'is_retired', type: 'boolean', default: false })
  isRetired: boolean;
}
