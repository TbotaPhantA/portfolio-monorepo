import { User } from '../../../../../src/auth/domain/user/user';
import { UserBuilder } from '../../../../__fixtures__/builders/user/user.builder';

describe(`${User.name}`, () => {
  describe(`${User.prototype.login.name}`, () => {
    const testCases = [
      {
        toString: () => '1',
        user: UserBuilder.defaultAll.with({
          username: 'username',
          passwordHash: '',
        }).result,
        authConfig: AuthConfig,
        expected: {

        },
      },
    ];

    test.each(testCases)('%s', () => {

    });
  });
});
