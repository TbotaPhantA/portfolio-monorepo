/* eslint-disable prettier/prettier */
import { AuthConfig, User } from '../../../../../src/auth/domain/user/user';
import { UserBuilder } from '../../../../__fixtures__/builders/user/user.builder';
import { AuthConfigBuilder } from '../../../../__fixtures__/builders/auth/authConfig.builder';
import * as jwt from 'jsonwebtoken';
import { getTimeInSeconds } from '../../../../shared/utils/getTimeInSeconds';
import { makePasswordHash } from '../../../../shared/utils/makePasswordHash';
import {
  REFRESH_TOKEN_NOT_FOUND,
  USERNAME_OR_PASSWORD_IS_NOT_VALID
} from '../../../../../src/infrastructure/shared/constants';
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
    const notThrowsTestCases = [
      {
        name: '1 valid admin credentials - should return valid tokens',
        user: UserBuilder.defaultAll.with({
          passwordHash: makePasswordHash(
            'correct password',
            AuthConfigBuilder.defaultAll.result,
          ),
        }).result,
        givenPassword: 'correct password',
        authConfig: AuthConfigBuilder.defaultAll.result,
        now: new Date(2022, 0, 3),
      },
      {
        name: '2 valid admin credentials - should return valid tokens',
        user: UserBuilder.defaultAll.with({
          passwordHash: makePasswordHash(
            'correct password 2',
            AuthConfigBuilder.defaultAll.result,
          ),
        }).result,
        givenPassword: 'correct password 2',
        authConfig: AuthConfigBuilder.defaultAll.result,
        now: new Date(2022, 0, 3),
      },
    ];

    test.each(notThrowsTestCases)(
      '$name',
      async ({ user, givenPassword, authConfig, now }) => {
        // arrange
        jest.useFakeTimers().setSystemTime(now);

        // act
        const resultTokens = await user.login(givenPassword, authConfig);

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

    const throwsTestCases = [
      {
        name: '1 invalid password - should throw',
        user: UserBuilder.defaultAll.with({
          passwordHash: makePasswordHash(
            'correct password',
            AuthConfigBuilder.defaultAll.result,
          ),
        }).result,
        givenPassword: 'incorrect password',
        authConfig: AuthConfigBuilder.defaultAll.result,
        now: new Date(2022, 0, 3),
      },
    ];

    test.each(throwsTestCases)(
      '$name',
      async ({ user, givenPassword, authConfig, now }) => {
        jest.useFakeTimers().setSystemTime(now);

        await expect(
          user.login(givenPassword, authConfig),
        ).rejects.toThrow(USERNAME_OR_PASSWORD_IS_NOT_VALID);
      },
    );
  });

  describe(User.prototype.refresh.name, () => {
    const throwsTestCases = [
      {
        name: '1 nonexistent token - should throw',
        now: new Date(2022, 0, 3),
        user: UserBuilder.defaultAll.result,
        token: 'nonexistent',
        authConfig: AuthConfigBuilder.defaultAll.result,
      },
      {
        name: '2 expired token - should throw',
        now: new Date(2022, 0, 3),
        user: UserBuilder.defaultAll.with({
          refreshTokens: [
            RefreshTokenBuilder.defaultPreInserted.with({
              token: 'expired-token',
              expiresAt: new Date(new Date(2022, 0, 3).getTime() - 1000),
            }).result,
          ],
        }).result,
        token: 'expired-token',
        authConfig: AuthConfigBuilder.defaultAll.result,
      },
    ];

    test.each(throwsTestCases)('$name', ({ user, now, token, authConfig }) => {
      jest.useFakeTimers().setSystemTime(now);
      expect(() => user.refresh(token, authConfig)).toThrow(REFRESH_TOKEN_NOT_FOUND);
    });

    const validTestCases = [
      {
        name: '1 valid refresh token - rotates and returns new tokens',
        user: UserBuilder.defaultAll.with({
          refreshTokens: [
            RefreshTokenBuilder.defaultPreInserted.with({
              token: 'current-refresh',
              expiresAt: new Date(
                new Date(2022, 0, 3).getTime() +
                  AuthConfigBuilder.defaultAll.result.refreshToken.expiryInSeconds * 1000,
              ),
            }).result,
          ],
        }).result,
        token: 'current-refresh',
        authConfig: AuthConfigBuilder.defaultAll.result,
        now: new Date(2022, 0, 3),
      },
    ];

    test.each(validTestCases)('$name', ({ user, token, authConfig, now }) => {
      jest.useFakeTimers().setSystemTime(now);

      const { accessToken, refreshToken } = user.refresh(token, authConfig);

      const accessPayload = jwt.verify(
        accessToken,
        authConfig.accessToken.privateKey,
      );
      const refreshPayload = jwt.verify(
        refreshToken,
        authConfig.refreshToken.privateKey,
      );

      expect({ accessPayload, refreshPayload })
        .toStrictEqual(makeExpectedPayload(user, authConfig, now));

      expect(user.refreshTokens).toHaveLength(1);
      expect(user.refreshTokens[0]).toStrictEqual(
        RefreshTokenBuilder.defaultPreInserted.with({
          token: refreshToken,
          expiresAt: new Date(
            now.getTime() + authConfig.refreshToken.expiryInSeconds * 1000,
          ),
        }).result,
      );
    });
  });
})
