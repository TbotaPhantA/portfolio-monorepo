import { InjectionBuilder } from 'ts-fixture-builder';
import { JWTTokens } from '../../../../../src/modules/auth/domain/user/valueObjects/JWTTokens';

export class JWTTokensBuilder {
  static get defaultAll(): InjectionBuilder<JWTTokens> {
    return new InjectionBuilder<JWTTokens>(
      new JWTTokens({
        jwtTokensVersion: 1,
        refreshTokens: [],
      }),
    );
  }
}
