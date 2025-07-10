import { InjectionBuilder } from 'ts-fixture-builder';
import { RefreshToken } from '../../../../src/auth/domain/user/refreshToken/refreshToken';
import { PLACEHOLDER_ID } from '../../../../src/infrastructure/shared/constants';

export class RefreshTokenBuilder {
  static get defaultAll(): InjectionBuilder<RefreshToken> {
    return new InjectionBuilder<RefreshToken>(new RefreshToken({
      refreshTokenId: 1,
      userId: 1,
      expiresAt: new Date(2022, 0, 3),
      token: 'token',
    }));
  }

  static get defaultPreInserted(): InjectionBuilder<RefreshToken> {
    return new InjectionBuilder<RefreshToken>(new RefreshToken({
      refreshTokenId: PLACEHOLDER_ID,
      userId: 1,
      expiresAt: new Date(2022, 0, 3),
      token: 'token',
    }));
  }
}
