import { RefreshToken } from './refreshToken/refreshToken';
import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserPayload, UserRoleEnum } from '@portfolio/contracts';
import { config } from '../../../../infrastructure/config/config';
import { NoMethods } from '../../../../infrastructure/shared/types/noMethods';
import { REFRESH_TOKEN_NOT_FOUND } from '../../../../infrastructure/shared/constants';
import * as _ from 'lodash';
import { Password } from './valueObjects/passwordHash';

export type AuthConfig = (typeof config)['auth'];
export type TokenPair = { accessToken: string; refreshToken: string };

export class User {
  userId: number;
  jwtTokensVersion: number;
  roles: UserRoleEnum[];
  username: string;
  password: Password;
  refreshTokens: RefreshToken[];

  constructor(raw: NoMethods<User>) {
    this.userId = raw.userId;
    this.jwtTokensVersion = raw.jwtTokensVersion;
    this.roles = raw.roles;
    this.username = raw.username;
    this.password = raw.password;
    this.refreshTokens = raw.refreshTokens;
  }

  async login(
    givenPassword: string,
    authConfig: AuthConfig,
  ): Promise<TokenPair> {
    await this.password.assertPasswordsMatch(givenPassword, authConfig);
    return this.initNewTokens(authConfig);
  }

  refresh(oldRefreshToken: string, authConfig: AuthConfig): TokenPair {
    const [stored] = _.remove(this.refreshTokens, { token: oldRefreshToken });
    this.assertRefreshTokenIsNotExpired(stored);
    return this.initNewTokens(authConfig);
  }

  private assertRefreshTokenIsNotExpired(stored: RefreshToken): void {
    if (!stored || stored.isExpired()) {
      throw new UnauthorizedException(REFRESH_TOKEN_NOT_FOUND);
    }
  }

  private initNewTokens(authConfig: AuthConfig): TokenPair {
    const sharedPayload = this.buildPayload();

    const accessToken = this.signJwt(sharedPayload, authConfig.accessToken);
    const refreshToken = this.signJwt(sharedPayload, authConfig.refreshToken);

    this.refreshTokens.push(
      RefreshToken.createByRefreshToken(refreshToken, this.userId),
    );

    return { accessToken, refreshToken };
  }

  private buildPayload(): UserPayload {
    return {
      userId: this.userId,
      jwtTokensVersion: this.jwtTokensVersion,
      roles: this.roles,
      username: this.username,
    };
  }

  private signJwt(
    payload: Record<string, any>,
    {
      privateKey,
      expiryInSeconds,
    }: { privateKey: string; expiryInSeconds: number },
  ) {
    return jwt.sign(payload, privateKey, { expiresIn: `${expiryInSeconds}s` });
  }
}
