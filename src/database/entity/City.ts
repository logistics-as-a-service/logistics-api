import { Entity, BaseEntity, Column, ManyToOne, JoinColumn } from 'typeorm';
import State from './State';

@Entity({ name: 'cities' })
export class City extends BaseEntity {
  @Column({ generated: 'increment', primary: true, type: 'integer' })
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => State, (state) => state.cities)
  @JoinColumn({ name: 'state_id' })
  state: State;
}
