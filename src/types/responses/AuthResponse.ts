export class AuthResponse {
  id: number;
  email: string;
  userType: number;
  accessTokens: {
    token: string;
    refreshToken: string;
    exp: string;
  };
}
