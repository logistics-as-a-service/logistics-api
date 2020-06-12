import { Repository, EntityRepository } from 'typeorm';
import User from '../entity/User';
import Utility from '../../Utils/Utility';

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
  async validateCred(email: string, password: string): Promise<User> {
    Utility.validateEmail(email);

    const user = await this.findOne({ email });
    if (!user) throw new Error('Invalid login credentials, check and try again.');

    const check = await user.validatePassword(password);
    if (!check) throw new Error('Invalid login credentials, check and try again.');

    return user;
  }
}
