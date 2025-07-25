import { InjectionBuilder } from 'ts-fixture-builder';
import { PLACEHOLDER_ID } from '../../../../src/infrastructure/shared/constants';
import { RefreshToken } from '../../../../src/modules/auth/domain/user/refreshToken/refreshToken';

export class RefreshTokenBuilder {
  static get defaultAll(): InjectionBuilder<RefreshToken> {
    return new InjectionBuilder<RefreshToken>(
      new RefreshToken({
        refreshTokenId: 1,
        userId: 1,
        expiresAt: new Date(2022, 0, 3),
        token: 'token',
      }),
    );
  }

  static get defaultPreInserted(): InjectionBuilder<RefreshToken> {
    return new InjectionBuilder<RefreshToken>(
      new RefreshToken({
        refreshTokenId: PLACEHOLDER_ID,
        userId: 1,
        expiresAt: new Date(2022, 0, 3),
        token: 'token',
      }),
    );
  }
}
