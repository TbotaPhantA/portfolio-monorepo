/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Database } from '../../../infrastructure/db/db.schema';
import { Kysely, sql, } from 'kysely';
import { InjectKysely } from 'nestjs-kysely';
import { User } from '../../domain/user/user';
import { RefreshToken } from '../../domain/user/refreshToken/refreshToken';
import { jsonBuildObject } from 'kysely/helpers/postgres'

@Injectable()
export class UserRepository {
  constructor(@InjectKysely() private readonly db: Kysely<Database>) {}

  async findByUsername(username: string): Promise<User | null> {
    const query = this.db
      .selectFrom('users')
      .leftJoin('refresh_tokens', 'users.user_id', 'refresh_tokens.user_id')
      .select(({ fn, ref }) => {
        return [
          'users.user_id as userId',
          'users.jwt_tokens_version as jwtTokensVersion',
          'users.roles as roles',
          'users.username as username',
          'users.salt as salt',
          'users.password_hash as passwordHash',
          fn.coalesce(
            fn.jsonAgg(
              jsonBuildObject({
                refresh_token_id: ref('refresh_tokens.refresh_token_id'),
                user_id: ref('refresh_tokens.user_id'),
                expires_at: ref('refresh_tokens.expires_at'),
                token: ref('refresh_tokens.token'),
              })
            ).filterWhere('refresh_tokens.refresh_token_id', 'is not', null),
            sql`'[]'`
          ).as('refresh_tokens')
        ]
      })
      .where('users.username', '=', username)
      .groupBy(['users.user_id'])

    const raw = await query.executeTakeFirst();

    if (!raw) return null;

    const refreshTokens = raw.refresh_tokens.map(
      (t) =>
        new RefreshToken({
          refreshTokenId: t.refresh_token_id!,
          userId: t.user_id!,
          expiresAt: t.expires_at!,
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
}
