/* eslint-disable prettier/prettier */
import { AuthConfig, User } from '../../../../../src/auth/domain/user/user';
import { UserBuilder } from '../../../../__fixtures__/builders/user/user.builder';
import { AuthConfigBuilder } from '../../../../__fixtures__/builders/auth/authConfig.builder';
import * as jwt from 'jsonwebtoken';
import { getTimeInSeconds } from '../../../../shared/utils/getTimeInSeconds';
import { makePasswordHash } from '../../../../shared/utils/makePasswordHash';
import { USERNAME_OR_PASSWORD_IS_NOT_VALID } from '../../../../../src/infrastructure/shared/constants';
import { RefreshTokenBuilder } from '../../../../__fixtures__/builders/user/refreshToken.builder';

const makeExpectedPayload = (
  userProps: User,
  authConfig: AuthConfig,
  now: Date,
) => {
  const {
    userId,
    roles,
    jwtTokensVersion: tokensVersion,
    username,
  } = userProps;
  const iat = getTimeInSeconds(now);

  const { accessToken, refreshToken } = authConfig;
  const makePayload = (
    tokenConfig: AuthConfig['accessToken'] | AuthConfig['refreshToken'],
  ) => ({
    userId,
    roles,
    jwtTokensVersion: tokensVersion,
    username,
    iat,
    exp: getTimeInSeconds(
      new Date(iat * 1000 + tokenConfig.expiryInSeconds * 1000),
    ),
  });

  return {
    accessPayload: makePayload(accessToken),
    refreshPayload: makePayload(refreshToken),
  };
};

describe(`${User.name}`, () => {
  describe(`${User.prototype.login.name}`, () => {
    describe('happy path', () => {
      const notThrowsTestCases = [
        {
          name: '1 valid admin credentials - should return valid tokens',
          user: UserBuilder.defaultAll.with({
            passwordHash: makePasswordHash(
              'correct password',
              AuthConfigBuilder.defaultAll.result,
            ),
          }).result,
          suppliedPassword: 'correct password',
          authConfig: AuthConfigBuilder.defaultAll.result,
          now: new Date(2022, 0, 3),
        },
      ];

      test.each(notThrowsTestCases)(
        '$name',
        async ({ user, suppliedPassword, authConfig, now }) => {
          // arrange
          jest.useFakeTimers().setSystemTime(now);

          // act
          const resultTokens = await user.login(suppliedPassword, authConfig);

          // assert
          const tokensPayload = assertTokensAreValid();
          expect(tokensPayload).toStrictEqual(makeExpectedPayload(user, authConfig, now));
          expect(user.refreshTokens[user.refreshTokens.length - 1])
            .toStrictEqual(
              RefreshTokenBuilder.defaultPreInserted.with({
                token: resultTokens.refreshToken,
                expiresAt: new Date(now.getTime() + authConfig.refreshToken.expiryInSeconds * 1000)
              }).result
            )

          function assertTokensAreValid() {
            const accessPayload = jwt.verify(
              resultTokens.accessToken,
              authConfig.accessToken.privateKey,
            );
            const refreshPayload = jwt.verify(
              resultTokens.refreshToken,
              authConfig.refreshToken.privateKey,
            );

            return { accessPayload, refreshPayload };
          }
        },
      );
    });

    describe('throws test cases', () => {
      const throwsTestCases = [
        {
          name: '1 invalid password - should throw',
          user: UserBuilder.defaultAll.with({
            passwordHash: makePasswordHash(
              'correct password',
              AuthConfigBuilder.defaultAll.result,
            ),
          }).result,
          suppliedPassword: 'incorrect password',
          authConfig: AuthConfigBuilder.defaultAll.result,
          now: new Date(2022, 0, 3),
        },
      ];

      test.each(throwsTestCases)(
        '$name',
        async ({ user, suppliedPassword, authConfig, now }) => {
          jest.useFakeTimers().setSystemTime(now);

          await expect(
            user.login(suppliedPassword, authConfig),
          ).rejects.toThrow(USERNAME_OR_PASSWORD_IS_NOT_VALID);
        },
      );
    });
  });
})
