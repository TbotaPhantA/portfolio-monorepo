import { InjectionBuilder } from 'ts-fixture-builder';
import { UserRoleEnum } from '@portfolio/contracts';
import { User } from '../../../../src/modules/auth/domain/user/user';
import { PasswordBuilder } from './valueObjects/password.builder';
import { JWTTokensBuilder } from './valueObjects/jwtTokens.builder';

export class UserBuilder {
  static get defaultAll(): InjectionBuilder<User> {
    return new InjectionBuilder<User>(
      new User({
        userId: 1,
        roles: [UserRoleEnum.ADMIN],
        username: 'username',
        password: PasswordBuilder.defaultAll.result,
        jwtTokens: JWTTokensBuilder.defaultAll.result,
      }),
    );
  }
}
