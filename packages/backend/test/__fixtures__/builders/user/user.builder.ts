import { InjectionBuilder } from 'ts-fixture-builder';
import { User } from '../../../../src/auth/domain/user/user';
import { makePasswordHash } from '../../../shared/utils/makePasswordHash';
import { AuthConfigBuilder } from '../auth/authConfig.builder';
import { makeSalt } from '../../../shared/utils/makeSalt';
import { UserRoleEnum } from '@portfolio/contracts';

export class UserBuilder {
  static get defaultAll(): InjectionBuilder<User> {
    return new InjectionBuilder<User>(
      new User({
        userId: 1,
        roles: [UserRoleEnum.ADMIN],
        jwtTokensVersion: 1,
        username: 'username',
        salt: makeSalt('salt', AuthConfigBuilder.defaultAll.result),
        passwordHash: makePasswordHash(
          'password',
          AuthConfigBuilder.defaultAll.result,
        ),
        refreshTokens: [],
      }),
    );
  }
}
