import * as assert from 'node:assert';
import { PLACEHOLDER_ID } from '../../../../infrastructure/shared/constants';
import { NoMethods } from '../../../../infrastructure/shared/types/noMethods';
import * as jwt from 'jsonwebtoken';
import { inspect } from 'node:util';

export class RefreshToken {
  refreshTokenId: number;
  userId: number;
  expiresAt: Date;
  token: string;

  constructor(raw: NoMethods<RefreshToken>) {
    this.refreshTokenId = raw.refreshTokenId;
    this.userId = raw.userId;
    this.expiresAt = raw.expiresAt;
    this.token = raw.token;
  }

  static createByRefreshToken(token: string, userId: number): RefreshToken {
    const payload = jwt.decode(token);
    assert.ok(
      payload && typeof payload === 'object' && payload.exp,
      `Invalid JWT payload: ${inspect(payload)}`,
    );
    return new RefreshToken({
      refreshTokenId: PLACEHOLDER_ID,
      userId,
      token,
      expiresAt: new Date(payload.exp * 1000),
    });
  }

  isExpired(): boolean {
    return this.expiresAt.getTime() < Date.now();
  }
}
