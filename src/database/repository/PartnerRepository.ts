import { Repository, EntityRepository } from 'typeorm';
import moment from 'moment';
import Partner from '../entity/Partner';

@EntityRepository(Partner)
export default class PartnerRepository extends Repository<Partner> {
  /**
   * Find with Subdomain
   */
  async findSubDomain(subdomain: string): Promise<Partner> {
    const partner = await this.findOneOrFail({ where: { subdomain }, relations: ['user'] });

    if (partner.subscriptionExpireDate > moment().toDate()) {
      throw new Error('Platform subscription expired!');
    }

    if (partner.user.isDisabled) throw new Error('User account disabled!');

    return partner;
  }
}
