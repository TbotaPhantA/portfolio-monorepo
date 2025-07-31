import * as crypto from 'crypto';
import { scrypt } from '../../../../../infrastructure/shared/utils/scrypt';
import { AuthConfig } from '../user';
import { UnauthorizedException } from '@nestjs/common';
import { USERNAME_OR_PASSWORD_IS_NOT_VALID } from '../../../../../infrastructure/shared/constants';
import { NoMethods } from '../../../../../infrastructure/shared/types/noMethods';

export class Password {
  salt: Buffer;
  passwordHash: Buffer;

  constructor(raw: NoMethods<Password>) {
    this.salt = raw.salt;
    this.passwordHash = raw.passwordHash;
  }

  async assertPasswordsMatch(givenPassword: string, authConfig: AuthConfig) {
    if (!(await this.doPasswordsMatch(givenPassword, authConfig))) {
      throw new UnauthorizedException(USERNAME_OR_PASSWORD_IS_NOT_VALID);
    }
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
}
