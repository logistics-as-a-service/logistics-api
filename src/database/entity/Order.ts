import { Entity, BaseEntity, Column, JoinColumn, BeforeInsert, ManyToOne } from 'typeorm';
import { EItemType } from '../../types/enums/EItemType';

import State from './State';
import { EPaymentStatus } from '../../types/enums/EPaymentStatus';
import { EDeliveryPaymentType } from '../../types/enums/EDeliveryPaymentType';
import Customer from './Customer';
import Partner from './Partner';

@Entity({ name: 'orders' })
export default class Order extends BaseEntity {
  @Column({ generated: 'increment', primary: true, type: 'integer' })
  id: number;

  @ManyToOne(() => Partner, (partner) => partner.orders)
  @JoinColumn({ name: 'partner_id' })
  partner: Partner;

  @Column({ type: 'float', name: 'item_weight' })
  itemWeight: number;

  @Column({ name: 'item_type' })
  itemType: EItemType;

  @Column({ name: 'item_description', type: 'text' })
  itemDescription: string;

  @Column({ name: 'pick_up_address', nullable: true })
  pickUpAddress: string;

  @JoinColumn({ name: 'pick_up_state_id' })
  pickUpStateId: State;

  @Column({ name: 'delivery_address', nullable: true })
  deliveryAddress: string;

  @ManyToOne(() => State)
  @JoinColumn({ name: 'delivery_state_id' })
  deliveryState: State;

  @Column({ name: 'delivery_instruction', type: 'text' })
  deliveryInstruction: string;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'distance_in_km', type: 'float' })
  distanceInKm: number;

  @Column({ type: 'money' })
  cost: string;

  @Column({ name: 'payment_status', nullable: false })
  paymentStatus: EPaymentStatus;

  @Column({ name: 'delivery_status', nullable: false })
  deliveryStatus: EDeliveryPaymentType;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @BeforeInsert()
  updateDatesOnInsert() {
    this.createdAt = new Date();
  }
}
