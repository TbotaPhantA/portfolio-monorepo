import { Injectable } from '@nestjs/common';
import { Database } from '../../../infrastructure/db/db.schema';
import { Kysely } from 'kysely';
import { InjectKysely } from 'nestjs-kysely';
import { User } from '../../domain/user/user';
import { RefreshToken } from '../../domain/user/refreshToken/refreshToken';

@Injectable()
export class UserRepository {
  constructor(@InjectKysely() private readonly db: Kysely<Database>) {}

  async findByUsername(username: string): Promise<User | null> {
    const raw = await this.db
      .selectFrom('users')
      .leftJoin('refresh_tokens', 'users.user_id', 'refresh_tokens.user_id')
      .select([
        'users.user_id as userId',
        'users.jwt_tokens_version as jwtTokensVersion',
        'users.roles as roles',
        'users.username as username',
        'users.salt as salt',
        'users.password_hash as passwordHash',
        this.db.fn
          .jsonAgg('refresh_tokens')
          .as('refreshTokens'),
      ])
      .where('users.username', '=', username)
      .groupBy(['users.user_id'])
      .executeTakeFirst()

    if (!raw) return null;

    const refreshTokens = raw.refreshTokens.map(
      (t) =>
        new RefreshToken({
          refreshTokenId: t.refresh_token_id,
          userId: t.user_id,
          expiresAt: t.expires_at,
          token: t.token,
        })
    )

    return new User({
      userId: raw.userId,
      jwtTokensVersion: raw.jwtTokensVersion,
      roles: raw.roles as any,
      username: raw.username,
      salt: raw.salt,
      passwordHash: raw.passwordHash,
      refreshTokens,
    })
  }
}
