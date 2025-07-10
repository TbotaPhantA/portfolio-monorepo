import { AuthConfig } from '../../../src/auth/domain/user/user';
import { scryptSync } from 'crypto';

export const makePasswordHash = (
  password: string,
  authConfig: Pick<
    AuthConfig,
    'encoding' | 'passwordPepper' | 'keyLengthInBytes'
  >,
): Buffer => {
  const salt = 'salt';
  const saltBuffer = Buffer.from(salt, authConfig.encoding);
  const pepperedSuppliedPassword = password + authConfig.passwordPepper;
  return scryptSync(
    pepperedSuppliedPassword,
    saltBuffer,
    authConfig.keyLengthInBytes,
  );
};
