import { Entity, BaseEntity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import State from './State';

@Entity({ name: 'lga' })
export class Lga extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => State, (state) => state.lga)
  @JoinColumn({ name: 'state_id' })
  state: State;
}
