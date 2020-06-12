import { EntityRepository, Repository } from 'typeorm';
import Admin from '../entity/Admin';
import { EUserType } from '../../types/enums/EUserType';
import Utility from '../../Utils/Utility';
import User from '../entity/User';

@EntityRepository(Admin)
export default class AdminRepository extends Repository<Admin> {
  createOrFail = async (payload: any) => {
    try {
      const { first_name: firstName, last_name: lastName, ...user } = payload;

      Utility.validateEmail(user.email);

      const check = await User.findOne({ email: user.email });
      if (check) throw new Error(`User with Email ${user.email} already exist`);

      const admin = this.create({
        firstName,
        lastName,
        user: {
          email: user.email,
          password: user.password,
          mobileNo: user.mobile_no,
          userType: EUserType.ADMIN,
        },
      });

      return this.save(admin, { reload: true });
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
