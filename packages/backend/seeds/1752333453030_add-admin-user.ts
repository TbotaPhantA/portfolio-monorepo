import type { Kysely } from 'kysely'
import { UserRoleEnum } from '../src/infrastructure/db/db.schema';
import { randomBytes } from 'crypto';
import { scrypt } from '../src/infrastructure/shared/utils/scrypt';
import { Database } from '../src/infrastructure/db/db.schema';

export async function seed(db: Kysely<Database>): Promise<void> {
  const {
    SALT_SIZE,
    KEY_LENGTH_IN_BYTES,
    PASSWORD_PEPPER,
    ENCODING,
    ADMIN_USERNAME,
    ADMIN_PASSWORD,
  } = process.env

  if (
    !SALT_SIZE ||
    !KEY_LENGTH_IN_BYTES ||
    !PASSWORD_PEPPER ||
    !ENCODING ||
    !ADMIN_USERNAME ||
    !ADMIN_PASSWORD
  ) {
    throw new Error('Missing required environment variables')
  }

  const saltSize = parseInt(SALT_SIZE, 10)
  const keyLen = parseInt(KEY_LENGTH_IN_BYTES, 10)

  // 1. Generate random salt
  const salt = randomBytes(saltSize)

  // 2. Derive password hash with scrypt
  const peppered = ADMIN_PASSWORD + PASSWORD_PEPPER
  const derived = await scrypt(peppered, salt, keyLen)

  // 3. Insert admin user
  await db
    .insertInto('users')
    .values({
      username: ADMIN_USERNAME,
      salt,
      password_hash: derived,
      jwt_tokens_version: 1,
      roles: [UserRoleEnum.ADMIN],
    })
    .execute()

  console.log(`Admin user '${ADMIN_USERNAME}' seeded successfully.`)
}
