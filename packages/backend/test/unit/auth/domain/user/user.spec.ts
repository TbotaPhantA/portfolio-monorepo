/* eslint-disable prettier/prettier */
import { AuthConfig, User } from '../../../../../src/auth/domain/user/user';
import { UserBuilder } from '../../../../__fixtures__/builders/user/user.builder';
import { AuthConfigBuilder } from '../../../../__fixtures__/builders/auth/authConfig.builder';
import * as jwt from 'jsonwebtoken';
import { UserRoleEnum } from '../../../../../src/auth/domain/enums/userRole.enum';
import { getTimeInSeconds } from '../../../../shared/utils/getTimeInSeconds';
import { makePasswordHash } from '../../../../shared/utils/makePasswordHash';
import { USERNAME_OR_PASSWORD_IS_NOT_VALID } from '../../../../../src/infrastructure/shared/constants';
import { makeSalt } from '../../../../shared/utils/makeSalt';
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
  const make = (
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
    accessToken: make(accessToken),
    refreshToken: make(refreshToken),
  };
};

describe(`${User.name}`, () => {
  describe(`${User.prototype.login.name}`, () => {
    describe('happy path', () => {
      const notThrowsTestCases = [
        {
          name: '1 valid admin credentials - should return valid tokens',
          user: UserBuilder.defaultAll.with({
            userId: 1,
            roles: [UserRoleEnum.ADMIN],
            jwtTokensVersion: 1,
            username: 'username',
            salt: makeSalt('salt', AuthConfigBuilder.defaultAll.result),
            passwordHash: makePasswordHash(
              'correct password',
              AuthConfigBuilder.defaultAll.result,
            ),
            refreshTokens: [],
          }).result,
          suppliedPassword: 'correct password',
          authConfig: AuthConfigBuilder.defaultAll.with({
            accessToken: {
              privateKey: 'privateKey1',
              expiryInSeconds: 100,
            },
            refreshToken: {
              privateKey: 'privateKey2',
              expiryInSeconds: 150,
            },
          }).result,
          now: new Date(2022, 0, 3),
        },
      ];

      test.each(notThrowsTestCases)(
        '$name',
        async ({ user, suppliedPassword, authConfig, now }) => {
          jest.useFakeTimers().setSystemTime(now);

          const resultTokens = await user.login(suppliedPassword, authConfig);

          const accessPayload = jwt.verify(
            resultTokens.accessToken,
            authConfig.accessToken.privateKey,
          );
          const refreshPayload = jwt.verify(
            resultTokens.refreshToken,
            authConfig.refreshToken.privateKey,
          );
          const expected = makeExpectedPayload(user, authConfig, now);
          expect({
            accessTokenPayload: accessPayload,
            refreshTokenPayload: refreshPayload,
          }).toStrictEqual({
            accessTokenPayload: expected.accessToken,
            refreshTokenPayload: expected.refreshToken,
          });
          expect(user.refreshTokens[user.refreshTokens.length - 1]).toStrictEqual(RefreshTokenBuilder.defaultPreInserted.with({
            token: resultTokens.refreshToken,
            expiresAt: new Date(now.getTime() + authConfig.refreshToken.expiryInSeconds * 1000)
          }).result)
        },
      );
    });

    describe('throws test cases', () => {
      const throwsTestCases = [
        {
          name: '1 invalid password - should throw',
          user: UserBuilder.defaultAll.with({
            userId: 1,
            roles: [UserRoleEnum.ADMIN],
            jwtTokensVersion: 1,
            username: 'username',
            salt: makeSalt('salt', AuthConfigBuilder.defaultAll.result),
            passwordHash: makePasswordHash(
              'correct password',
              AuthConfigBuilder.defaultAll.result,
            ),
            refreshTokens: [],
          }).result,
          suppliedPassword: 'incorrect password',
          authConfig: AuthConfigBuilder.defaultAll.with({
            accessToken: {
              privateKey: 'privateKey1',
              expiryInSeconds: 100,
            },
            refreshToken: {
              privateKey: 'privateKey2',
              expiryInSeconds: 150,
            },
          }).result,
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