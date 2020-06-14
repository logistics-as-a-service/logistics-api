import { Entity, BaseEntity, Column, OneToMany } from 'typeorm';
import { Lga } from './Lga';
import { City } from './City';

@Entity({ name: 'states' })
export default class State extends BaseEntity {
  @Column({ generated: 'increment', primary: true, type: 'integer' })
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  lat: string;

  @Column({ nullable: true })
  lng: string;

  @Column({ name: 'min_lng', nullable: true })
  minLng: string;

  @Column({ name: 'max_lng', nullable: true })
  maxLng: string;

  @Column({ name: 'min_lat', nullable: true })
  minLat: string;

  @Column({ name: 'max_lat', nullable: true })
  maxLat: string;

  @OneToMany(() => City, (city) => city.state, { cascade: true })
  cities: City[];

  @OneToMany(() => Lga, (lga) => lga.state, { cascade: true })
  lgas: Lga[];
}
