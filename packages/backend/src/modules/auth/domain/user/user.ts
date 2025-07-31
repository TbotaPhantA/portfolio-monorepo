import { UserPayload, UserRoleEnum } from '@portfolio/contracts';
import { config } from '../../../../infrastructure/config/config';
import { NoMethods } from '../../../../infrastructure/shared/types/noMethods';
import { Password } from './valueObjects/passwordHash';
import { JWTTokens } from './valueObjects/JWTTokens';

export type AuthConfig = (typeof config)['auth'];
export type TokenPair = { accessToken: string; refreshToken: string };

export class User {
  userId: number;
  roles: UserRoleEnum[];
  username: string;
  password: Password;
  jwtTokens: JWTTokens;

  constructor(raw: NoMethods<User>) {
    this.userId = raw.userId;
    this.roles = raw.roles;
    this.username = raw.username;
    this.password = raw.password;
    this.jwtTokens = raw.jwtTokens;
  }

  async login(givenPassword: string, config: AuthConfig): Promise<TokenPair> {
    await this.password.assertPasswordsMatch(givenPassword, config);
    const payload = this.buildPayload();
    return this.jwtTokens.signPair(payload, config);
  }

  refresh(oldRefreshToken: string, config: AuthConfig): TokenPair {
    const oldToken = this.jwtTokens.remove(oldRefreshToken);
    this.jwtTokens.assertRefreshTokenIsNotExpired(oldToken);
    const payload = this.buildPayload();
    return this.jwtTokens.signPair(payload, config);
  }

  private buildPayload(): UserPayload {
    return {
      userId: this.userId,
      jwtTokensVersion: this.jwtTokens.jwtTokensVersion,
      roles: this.roles,
      username: this.username,
    };
  }
}
