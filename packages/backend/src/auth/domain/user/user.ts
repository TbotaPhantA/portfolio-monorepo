import { UserRoleEnum } from '../enums/userRole.enum';
import { NoMethods } from '../../../infrastructure/shared/types/noMethods';
import { RefreshToken } from './refreshToken/refreshToken';
import type { config } from '../../../infrastructure/config/config';
import { scrypt } from '../../../infrastructure/shared/utils/scrypt';
import * as crypto from 'crypto';
import { UnauthorizedException } from '@nestjs/common';
import {
  PLACEHOLDER_ID,
  USERNAME_OR_PASSWORD_IS_NOT_VALID,
} from '../../../infrastructure/shared/constants';
import * as jwt from 'jsonwebtoken';

export type AuthConfig = (typeof config)['auth'];
export type TokenPair = { accessToken: string; refreshToken: string };

export class User {
  userId: number;
  jwtTokensVersion: number;
  roles: UserRoleEnum[];
  username: string;
  salt: Buffer;
  passwordHash: Buffer;
  refreshTokens: RefreshToken[];

  constructor(raw: NoMethods<User>) {
    this.userId = raw.userId;
    this.jwtTokensVersion = raw.jwtTokensVersion;
    this.roles = raw.roles;
    this.username = raw.username;
    this.salt = raw.salt;
    this.passwordHash = raw.passwordHash;
    this.refreshTokens = raw.refreshTokens;
  }

  async login(
    givenPassword: string,
    authConfig: AuthConfig,
  ): Promise<TokenPair> {
    if (!(await this.doPasswordsMatch(givenPassword, authConfig))) {
      throw new UnauthorizedException(USERNAME_OR_PASSWORD_IS_NOT_VALID);
    }

    const sharedPayload = {
      userId: this.userId,
      jwtTokensVersion: this.jwtTokensVersion,
      roles: this.roles,
      username: this.username,
    };

    const accessToken = this.signJwt(sharedPayload, authConfig.accessToken);
    const refreshToken = this.signJwt(sharedPayload, authConfig.refreshToken);

    this.refreshTokens.push(
      RefreshToken.createByRefreshToken(refreshToken, PLACEHOLDER_ID),
    );

    return { accessToken, refreshToken };
  }

  private async doPasswordsMatch(
    givenPassword: string,
    { passwordPepper, keyLengthInBytes }: AuthConfig,
  ): Promise<boolean> {
    const givenHash = await scrypt(
      givenPassword + passwordPepper,
      this.salt,
      keyLengthInBytes,
    );

    return (
      givenHash.length === this.passwordHash.length &&
      crypto.timingSafeEqual(givenHash, this.passwordHash)
    );
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
