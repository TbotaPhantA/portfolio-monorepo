import { AuthConfig } from '../../../src/modules/auth/domain/user/user';

export const makeSalt = (
  salt: string,
  authConfig: Pick<AuthConfig, 'encoding'>,
) => Buffer.from(salt, authConfig.encoding);
