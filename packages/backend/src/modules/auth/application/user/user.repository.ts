import { Injectable } from '@nestjs/common';
import { sql } from 'kysely';
import { User } from '../../domain/user/user';
import { RefreshToken } from '../../domain/user/refreshToken/refreshToken';
import { jsonArrayFrom } from 'kysely/helpers/postgres';
import { TransactionHost } from '@nestjs-cls/transactional';
import { Span } from 'nestjs-otel';
import { UserRoleEnum } from '@portfolio/contracts';
import { KyselyCLS } from '../../../../infrastructure/shared/types/kyselyCLS';
import { Password } from '../../domain/user/valueObjects/passwordHash';
import { JWTTokens } from '../../domain/user/valueObjects/JWTTokens';

@Injectable()
export class UserRepository {
  constructor(private readonly db: TransactionHost<KyselyCLS>) {}

  @Span()
  async findByUsername(username: string): Promise<User | null> {
    const query = this.db.tx
      .selectFrom('users')
      .select((eb) => {
        return [
          'users.userId',
          'users.jwtTokensVersion',
          sql<UserRoleEnum[]>`array_to_json(users.roles)`.as('roles'),
          'users.username',
          'users.salt',
          'users.passwordHash',
          jsonArrayFrom(
            eb
              .selectFrom('refreshTokens')
              .select([
                'refreshTokens.refreshTokenId',
                'refreshTokens.userId',
                'refreshTokens.expiresAt',
                'refreshTokens.token',
              ])
              .whereRef('refreshTokens.userId', '=', 'users.userId'),
          ).as('refreshTokens'),
        ];
      })
      .where('users.username', '=', username)
      .groupBy(['users.userId']);

    const userRow = await query.executeTakeFirst();

    if (!userRow) return null;

    return new User({
      ...userRow,
      password: new Password(userRow),
      jwtTokens: new JWTTokens({
        jwtTokensVersion: userRow.jwtTokensVersion,
        refreshTokens: userRow.refreshTokens.map(
          (t) =>
            new RefreshToken({
              ...t,
              expiresAt: new Date(Date.parse(t.expiresAt)),
            }),
        ),
      }),
    });
  }

  @Span()
  async insertRefreshTokens(refreshTokens: RefreshToken[]): Promise<void> {
    await this.db.tx
      .insertInto('refreshTokens')
      .values(
        refreshTokens.map((token) => ({
          userId: token.userId,
          expiresAt: token.expiresAt,
          token: token.token,
        })),
      )
      .execute();
  }
}
