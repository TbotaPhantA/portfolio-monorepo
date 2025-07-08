import { NoMethods } from '../../../../infrastructure/shared/types/noMethods';

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
}

