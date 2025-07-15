import { InjectionBuilder } from 'ts-fixture-builder';
import { UserPayload } from '../../../../src/infrastructure/shared/types/userPayload';
import { UserRoleEnum } from '../../../../src/auth/domain/enums/userRole.enum';

export class UserPayloadBuilder {
  static get defaultAll(): InjectionBuilder<UserPayload> {
    return new InjectionBuilder<UserPayload>({
      userId: 1,
      roles: [UserRoleEnum.ADMIN],
      jwtTokensVersion: 1,
      username: 'username',
    });
  }
}
