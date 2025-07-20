import { Injectable } from '@nestjs/common';
import { UserRoleEnum } from '../../../infrastructure/db/db.schema';
import { sql } from 'kysely';
import { User } from '../../domain/user/user';
import { RefreshToken } from '../../domain/user/refreshToken/refreshToken';
import { jsonArrayFrom } from 'kysely/helpers/postgres';
import { TransactionHost } from '@nestjs-cls/transactional';
import { KyselyCLS } from '../../../infrastructure/shared/types/kyselyCLS';

@Injectable()
export class UserRepository {
  constructor(private readonly db: TransactionHost<KyselyCLS>) {}

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
      refreshTokens: userRow.refreshTokens.map((t) => new RefreshToken(t)),
    });
  }

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
