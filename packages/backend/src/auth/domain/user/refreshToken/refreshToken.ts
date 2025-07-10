import { NoMethods } from '../../../../infrastructure/shared/types/noMethods';

export class RefreshToken {
  expiresAt: Date;
  token: string;

  constructor(raw: NoMethods<RefreshToken>) {
    this.expiresAt = raw.expiresAt;
    this.token = raw.token;
  }
}

