import { AuthConfig } from '../../../src/auth/domain/user/user';

export const makeSalt = (
  salt: string,
  authConfig: Pick<AuthConfig, 'encoding'>,
) => Buffer.from(salt, authConfig.encoding);
