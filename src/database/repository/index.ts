import { getConnection } from 'typeorm';
import UserRepository from './UserRepository';
import AdminRepository from './AdminRepository';

const connection = getConnection();

export function getUserRepository(): UserRepository {
  return connection.getCustomRepository(UserRepository);
}

export function getAdminRepository(): AdminRepository {
  return connection.getCustomRepository(AdminRepository);
}
