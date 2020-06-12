import { getConnection } from 'typeorm';
import UserRepository from './UserRepository';

const connection = getConnection();

export function getUserRepository(): UserRepository {
  return connection.getCustomRepository(UserRepository);
}
