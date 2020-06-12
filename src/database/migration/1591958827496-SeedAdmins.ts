import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import { EUserType } from '../../types/enums/EUserType';
import Admin from '../entity/Admin';

export class SeedAdmins1591958827496 implements MigrationInterface {
  public async up(_queryRunner: QueryRunner): Promise<void> {
    const adminRepo = getRepository(Admin);

    const adminUsers = [
      {
        firstName: 'Abayomi',
        lastName: 'Oyewolee',
        user: {
          email: 'samsoft@logisticsant.com',
          password: 'password',
          mobileNo: '07063317344',
          userType: EUserType.ADMIN,
        },
      },
      {
        firstName: 'Godson',
        lastName: 'Ositadinmma',
        user: {
          email: 'godson@logisticsant.com',
          password: 'password',
          mobileNo: '08164334657',
          userType: EUserType.ADMIN,
        },
      },
      {
        firstName: 'Anthony',
        lastName: 'Agbatorr',
        user: {
          email: 'anthony@logisticsant.com',
          password: 'password',
          mobileNo: '07066365036',
          userType: EUserType.ADMIN,
        },
      },
    ];

    // queryRunner.manager.createQueryBuilder().insert().insert().into('').values([]).execute();
    const admins = adminRepo.create(adminUsers);
    await adminRepo.save(admins);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
