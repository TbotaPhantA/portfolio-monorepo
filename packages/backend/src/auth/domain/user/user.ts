import { UserRoleEnum } from '../enums/userRole.enum';
import { NoMethods } from '../../../infrastructure/shared/types/noMethods';
import { RefreshToken } from './refreshToken/refreshToken';
import type { config } from '../../../infrastructure/config/config';
import { scrypt } from '../../../infrastructure/shared/utils/scrypt';
import * as crypto from 'crypto';
import { UnauthorizedException } from '@nestjs/common';
import { USERNAME_OR_PASSWORD_IS_NOT_VALID } from '../../../infrastructure/shared/constants';
import * as jwt from 'jsonwebtoken';

export type AuthConfig = (typeof config)['auth'];

export class User {
  userId: number;
  roles: UserRoleEnum[];
  jwtTokensVersion: number;
  username: string;
  salt: Buffer;
  passwordHash: Buffer;
  refreshTokens: RefreshToken[];

  constructor(raw: NoMethods<User>) {
    this.userId = raw.userId;
    this.roles = raw.roles;
    this.jwtTokensVersion = raw.jwtTokensVersion;
    this.username = raw.username;
    this.salt = raw.salt;
    this.passwordHash = raw.passwordHash;
    this.refreshTokens = raw.refreshTokens;
  }

  async login(
    suppliedPassword: string,
    authConfig: AuthConfig,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (!(await this.doPasswordsMatch(suppliedPassword, authConfig))) {
      throw new UnauthorizedException(USERNAME_OR_PASSWORD_IS_NOT_VALID);
    }

    const sharedPayload = {
      userId: this.userId,
      roles: this.roles,
      jwtTokensVersion: this.jwtTokensVersion,
      username: this.username,
    };

    return {
      accessToken: this.signJwt(sharedPayload, authConfig.accessToken),
      refreshToken: this.signJwt(sharedPayload, authConfig.refreshToken),
    };
  }

  private async doPasswordsMatch(
    suppliedPassword: string,
    { passwordPepper, keyLengthInBytes }: AuthConfig,
  ): Promise<boolean> {
    const hash = await scrypt(
      suppliedPassword + passwordPepper,
      this.salt,
      keyLengthInBytes,
    );

    return (
      hash.length === this.passwordHash.length &&
      crypto.timingSafeEqual(hash, this.passwordHash)
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
