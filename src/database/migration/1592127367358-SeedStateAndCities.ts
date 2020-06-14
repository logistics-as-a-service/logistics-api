import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import State from '../entity/State';
import AxiosService from '../../Utils/AxiosRequest';

const stateUrlPath = 'http://locationsng-api.herokuapp.com/api/v1/states/:state/details';
const reqPath = path.join(__dirname, '../../../states-and-cities.json');
const data = fs.readFileSync(reqPath, { encoding: 'utf8' });
const parsedData = JSON.parse(data);

export class SeedStateAndCities1592127367358 implements MigrationInterface {
  public async up(_queryRunner: QueryRunner): Promise<void> {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < parsedData.length; i++) {
      const stateUrl = stateUrlPath.replace(':state', parsedData[i].state.name);
      const { data: state }: any = await AxiosService.request(null, stateUrl, 'GET', {});

      //   console.log(stateUrl, data);

      const lgas = state.lgas ? state.lgas.map((lga) => ({ name: lga })) : [];
      const cities = parsedData[i].state.locals.map((city) => ({ name: city.name }));

      const stateObj: Partial<State> = {
        name: parsedData[i].state.name,
        lat: state.latitude,
        lng: state.longitude,
        maxLat: state.maxLat,
        maxLng: state.maxLong,
        minLat: state.minLat,
        minLng: state.minLong,
        cities,
        lgas,
      };

      await getRepository(State).save(stateObj);
    }
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
