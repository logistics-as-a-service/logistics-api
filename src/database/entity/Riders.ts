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
import { IMailer } from '../../types/interfaces/IMailer';
import { LogisticsEmitter, EventType } from '../../Utils/Emittery';

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

  sendVerificationMail() {
    const payload: Partial<IMailer> = {
      to: [{ name: this.lastName, email: this.user.email }],
      subject: 'Verified your email',
      templateId: 'signup',
      isMultiple: false,
      templateData: {
        type: 'Rider',
        name: this.lastName,
        verificationLink: this.user.verificationToken,
        partner: this.partner.companyName,
      },
    };

    LogisticsEmitter.emit({ type: EventType.SendWelcomeEmail, payload });
  }
}
