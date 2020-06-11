import { Entity, BaseEntity, Column, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import User from './User';
import Partner from './Partner';

@Entity({ name: 'riders' })
export default class Rider extends BaseEntity {
  @Column({ generated: 'increment', primary: true, type: 'integer' })
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Partner, (partner) => partner.riders)
  @JoinColumn({ name: 'partner_id' })
  partner: Partner;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'profile_image' })
  profileImage: string;

  @Column({ name: 'is_engaged', type: 'boolean' })
  isEngaged: boolean;
}
