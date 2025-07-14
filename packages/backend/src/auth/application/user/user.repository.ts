import { Injectable } from '@nestjs/common';
import { Database, UserRoleEnum } from '../../../infrastructure/db/db.schema';
import { Kysely, sql } from 'kysely';
import { InjectKysely } from 'nestjs-kysely';
import { User } from '../../domain/user/user';
import { RefreshToken } from '../../domain/user/refreshToken/refreshToken';
import { jsonBuildObject } from 'kysely/helpers/postgres';

@Injectable()
export class UserRepository {
  constructor(@InjectKysely() private readonly db: Kysely<Database>) {}

  async findByUsername(username: string): Promise<User | null> {
    const query = this.db
      .selectFrom('users')
      .leftJoin('refreshTokens', 'users.userId', 'refreshTokens.userId')
      .select(({ fn, ref }) => {
        return [
          'users.userId',
          'users.jwtTokensVersion',
          sql<UserRoleEnum[]>`array_to_json(users.roles)`.as('roles'),
          'users.username',
          'users.salt',
          'users.passwordHash',
          fn
            .coalesce(
              fn
                .jsonAgg(
                  jsonBuildObject({
                    refreshTokenId: ref('refreshTokens.refreshTokenId'),
                    userId: ref('refreshTokens.userId'),
                    expiresAt: ref('refreshTokens.expiresAt'),
                    token: ref('refreshTokens.token'),
                  }),
                )
                .filterWhere('refreshTokens.userId', 'is not', null),
              sql`'[]'`,
            )
            .as('refreshTokens'),
        ];
      })
      .where('users.username', '=', username)
      .groupBy(['users.userId']);

    const raw = await query.executeTakeFirst();

    if (!raw) return null;

    const refreshTokens = raw.refreshTokens.map(
      (t) =>
        new RefreshToken({
          refreshTokenId: t.refreshTokenId!,
          userId: t.userId!,
          expiresAt: t.expiresAt!,
          token: t.token!,
        }),
    );

    return new User({
      userId: raw.userId,
      jwtTokensVersion: raw.jwtTokensVersion,
      roles: raw.roles,
      username: raw.username,
      salt: raw.salt,
      passwordHash: raw.passwordHash,
      refreshTokens,
    });
  }

  async insertRefreshTokens(refreshTokens: RefreshToken[]): Promise<void> {
    await this.db
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
