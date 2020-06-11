import { Entity, BaseEntity, Column, OneToMany } from 'typeorm';
import { Lga } from './Lga';

@Entity({ name: 'states' })
export default class State extends BaseEntity {
  @Column({ generated: 'increment', primary: true, type: 'integer' })
  id: number;

  @Column()
  name: string;

  @Column()
  lat: string;

  @Column()
  lng: string;

  @Column({ name: 'min_lng' })
  minLng: string;

  @Column({ name: 'max_lng' })
  maxLng: string;

  @Column({ name: 'min_lat' })
  minLat: string;

  @Column({ name: 'max_lat' })
  maxLat: string;

  @OneToMany(() => Lga, (lga) => lga.state)
  lga: Lga[];
}
