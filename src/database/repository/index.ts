import { getConnection } from 'typeorm';
import UserRepository from './UserRepository';
import AdminRepository from './AdminRepository';
import PartnerRepository from './PartnerRepository';
import DeliverySettingsRepository from './DeliverySettingsRepository';

const connection = getConnection();

export function getUserRepository(): UserRepository {
  return connection.getCustomRepository(UserRepository);
}

export function getAdminRepository(): AdminRepository {
  return connection.getCustomRepository(AdminRepository);
}

export function getPartnerRepository(): PartnerRepository {
  return connection.getCustomRepository(PartnerRepository);
}

export function getDeliverySettingsRepository(): DeliverySettingsRepository {
  return connection.getCustomRepository(DeliverySettingsRepository);
}
