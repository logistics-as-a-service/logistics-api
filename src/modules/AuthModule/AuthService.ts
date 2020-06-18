import jwt from 'jsonwebtoken';
import config from 'config';
import User from '../../database/entity/User';
import CustomError from '../../Utils/CustomError';

import { AuthResponse } from '../../types/responses/AuthResponse';

const { secret, refreshSecret, signOptions } = config.get('auth');

export default class AuthService {
  //
  static async getAuthToken(user: User): Promise<AuthResponse | CustomError> {
    const data = {
      id: user.id,
      email: user.email,
      userType: user.userType,
    };

    const { expiresIn, refreshExpIn } = signOptions;

    return new Promise((resolve, reject) => {
      try {
        const token = jwt.sign({ exp: expiresIn, user: data }, secret);
        const refreshToken = jwt.sign({ exp: refreshExpIn, user: data }, refreshSecret);

        const accessTokens = { token, refreshToken, exp: expiresIn };

        return resolve({ ...data, accessTokens });
      } catch (error) {
        return reject(new CustomError(404, error.message));
      }
    });
  }
}
