import { UnauthorizedException } from '@nestjs/common';
import { NoMethods } from '../../../../../infrastructure/shared/types/noMethods';
import { RefreshToken } from '../refreshToken/refreshToken';
import * as _ from 'lodash';
import * as jwt from 'jsonwebtoken';
import { REFRESH_TOKEN_NOT_FOUND } from '../../../../../infrastructure/shared/constants';
import { AuthConfig, TokenPair } from '../user';
import { UserPayload } from '@portfolio/contracts';

export class JWTTokens {
  jwtTokensVersion: number;
  refreshTokens: RefreshToken[];

  constructor(raw: NoMethods<JWTTokens>) {
    this.jwtTokensVersion = raw.jwtTokensVersion;
    this.refreshTokens = raw.refreshTokens;
  }

  remove(oldRefreshToken: string): RefreshToken {
    return _.remove(this.refreshTokens, { token: oldRefreshToken })[0];
  }

  assertRefreshTokenIsNotExpired(stored: RefreshToken): void {
    if (!stored || stored.isExpired()) {
      throw new UnauthorizedException(REFRESH_TOKEN_NOT_FOUND);
    }
  }

  signPair(payload: UserPayload, config: AuthConfig): TokenPair {
    const accessToken = jwt.sign(payload, config.accessToken.privateKey, {
      expiresIn: `${config.accessToken.expiryInSeconds}s`,
    });
    const refreshToken = jwt.sign(payload, config.refreshToken.privateKey, {
      expiresIn: `${config.refreshToken.expiryInSeconds}s`,
    });

    this.refreshTokens.push(
      RefreshToken.createByRefreshToken(refreshToken, payload.userId),
    );

    return { accessToken, refreshToken };
  }
}
