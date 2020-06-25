import { Repository, EntityRepository } from 'typeorm';
import DeliverySettings from '../entity/DeliverySettings';

@EntityRepository(DeliverySettings)
export default class DeliverySettingsRepository extends Repository<DeliverySettings> {
  async findByIdAndLowerBoundAndPartner(
    id: number,
    lowerBound: number,
    partnerId: number
  ): Promise<any> {
    const deliverySettings = await this.createQueryBuilder('delivery_settings')
      .where(
        'delivery_settings.id <> :id and (delivery_settings.lower_bound > :lowerBound or delivery_settings.upper_bound > :lowerBound) and delivery_settings.partner_id = :partnerId',
        { id, lowerBound, partnerId }
      )
      .getOne();

    if (deliverySettings) throw new Error('Delivery Settings already exist for this bounds');

    return deliverySettings;
  }

  async findByLowerBoundAndPartner(lowerBound: number, partnerId: number): Promise<any> {
    const deliverySettings = await this.createQueryBuilder('delivery_settings')
      .where(
        '(delivery_settings.lower_bound > :lowerBound or delivery_settings.upper_bound > :lowerBound) and delivery_settings.partner_id = :partnerId',
        { lowerBound, partnerId }
      )
      .getOne();

    if (deliverySettings) throw new Error('Delivery Settings already exist for this bounds');

    return deliverySettings;
  }

  async findByIdAndPartner(id: number, partnerId: number): Promise<any> {
    const deliverySettings = await this.createQueryBuilder('delivery_settings')
      .where('delivery_settings.id = :id and delivery_settings.partner_id = :partnerId', {
        id,
        partnerId,
      })
      .getOne();

    if (!deliverySettings) throw new Error('Delivery Settings does not exist');

    return deliverySettings;
  }

  async findByPartnerId(partnerId: number, page: number, pageSize: number): Promise<object> {
    const [deliverySettings, total] = await this.findAndCount({
      where: { partner: partnerId },
      order: { id: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { data: deliverySettings, total };
  }
}
