import { UserRoleEnum } from '../enums/userRole.enum';
import { NoMethods } from '../../../infrastructure/shared/types/noMethods';
import { RefreshToken } from './refreshToken/refreshToken';

export class User {
  userId: number;
  role: UserRoleEnum;
  accessTokensVersion: number;
  username: string;
  salt: string;
  passwordHash: string;
  refreshTokens: RefreshToken[];

  constructor(raw: NoMethods<User>) {
    this.userId = raw.userId;
    this.role = raw.role;
    this.accessTokensVersion = raw.accessTokensVersion;
    this.username = raw.username;
    this.salt = raw.salt;
    this.passwordHash = raw.passwordHash;
    this.refreshTokens = raw.refreshTokens;
  }
}
