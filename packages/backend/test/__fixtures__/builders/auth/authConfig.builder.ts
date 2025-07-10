import { InjectionBuilder } from 'ts-fixture-builder';
import { Config } from '../../../../src/infrastructure/config/config';

export class AuthConfigBuilder {
  static get defaultAll(): InjectionBuilder<Config['auth']> {
    return new InjectionBuilder<Config['auth']>({
      saltSize: 1,
      encoding: 'hex',
      keyLengthInBytes: 8,
      passwordPepper: 'passwordPepper',
      accessToken: {
        privateKey: 'privateKey',
        expiryInSeconds: 200,
      },
      refreshToken: {
        privateKey: 'privateKey',
        expiryInSeconds: 200,
      },
    });
  }
}
