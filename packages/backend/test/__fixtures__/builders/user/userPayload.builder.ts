import { InjectionBuilder } from 'ts-fixture-builder';
import { UserPayload, UserRoleEnum } from '@portfolio/contracts';

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
