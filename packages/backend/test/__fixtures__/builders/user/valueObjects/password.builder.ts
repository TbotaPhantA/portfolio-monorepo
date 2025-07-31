import { InjectionBuilder } from 'ts-fixture-builder';
import { makeSalt } from '../../../../shared/utils/makeSalt';
import { AuthConfigBuilder } from '../../auth/authConfig.builder';
import { makePasswordHash } from '../../../../shared/utils/makePasswordHash';
import { Password } from '../../../../../src/modules/auth/domain/user/valueObjects/passwordHash';

export class PasswordBuilder {
  static get defaultAll(): InjectionBuilder<Password> {
    return new InjectionBuilder<Password>(
      new Password({
        salt: makeSalt('salt', AuthConfigBuilder.defaultAll.result),
        passwordHash: makePasswordHash(
          'password',
          AuthConfigBuilder.defaultAll.result,
        ),
      }),
    );
  }
}
