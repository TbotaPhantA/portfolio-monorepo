import type { Kysely } from 'kysely'
import { sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  const { schema } = db;

  await sql.raw('CREATE EXTENSION ltree').execute(db)

  // Enums
  await schema
    .createType('user_role_enum')
    .asEnum(['ADMIN', 'VISITOR'])
    .execute()

  await schema
    .createType('post_status_enum')
    .asEnum(['DRAFT', 'PUBLIC'])
    .execute()

  await schema
    .createType('post_type_enum')
    .asEnum(['ARTICLE', 'BOOK_REVIEW'])
    .execute()

  await schema
    .createType('language_enum')
    .asEnum(['EN', 'RU'])
    .execute()

  // Tables
  await schema
    .createTable('users')
    .addColumn('user_id', 'serial', col => col.primaryKey())
    .addColumn('jwt_tokens_version', 'smallint', col => col.notNull().defaultTo(1))
    .addColumn('roles', sql`user_role_enum[]`, col => col.notNull())
    .addColumn('username', 'varchar(31)', col => col.notNull())
    .addColumn('salt', 'bytea', col => col.notNull())
    .addColumn('password_hash', 'bytea', col => col.notNull())
    .execute()

  await schema
    .createTable('refresh_tokens')
    .addColumn('refresh_token_id', 'serial', col => col.primaryKey())
    .addColumn('user_id', 'int4', col => col.notNull())
    .addColumn('expires_at', 'timestamp', col => col.notNull())
    .addColumn('token', 'varchar', col => col.notNull())
    .execute()

  await schema
    .createTable('posts')
    .addColumn('post_id', 'serial', col => col.primaryKey())
    .addColumn('user_id', 'int4', col => col.notNull())
    .addColumn('status', sql`post_status_enum`, col => col.notNull())
    .addColumn('type', sql`post_type_enum`, col => col.notNull())
    .addColumn('language', sql`language_enum`, col => col.notNull())
    .addColumn('created_at', 'timestamptz', col => col.notNull().defaultTo(sql`now()`))
    .addColumn('title', 'varchar(255)', col => col.notNull())
    .addColumn('body', 'text', col => col.notNull())
    .addColumn('tags', sql`text[]`, col => col)
    .execute()

  await schema
    .createTable('comments')
    .addColumn('comment_id', 'serial', col => col.primaryKey())
    .addColumn('post_id', 'int4', col => col.notNull())
    .addColumn('user_id', 'int4', col => col.notNull())
    .addColumn('created_at', 'timestamptz', col => col.notNull().defaultTo(sql`now()`))
    .addColumn('path', sql`ltree`, col => col.notNull())
    .addColumn('body', 'text', col => col.notNull())
    .execute()

  // Indexes
  await schema
    .createIndex('users_username_unique')
    .on('users')
    .column('username')
    .unique()
    .execute()

  await schema
    .createIndex('refresh_tokens_user_token_expires_unique')
    .on('refresh_tokens')
    .columns(['user_id', 'token', 'expires_at'])
    .unique()
    .execute()

  await schema
    .createIndex('posts_user_id_hash')
    .on('posts')
    .column('user_id')
    .using('hash')
    .execute()

  await schema
    .createIndex('posts_language_title_unique')
    .on('posts')
    .columns(['language', 'title'])
    .unique()
    .using('btree')
    .execute()

  await schema
    .createIndex('posts_language_created_at')
    .on('posts')
    .columns(['language', 'created_at'])
    .using('btree')
    .execute()

  await schema
    .createIndex('comments_user_id_hash')
    .on('comments')
    .column('user_id')
    .using('hash')
    .execute()

  await schema
    .createIndex('comments_post_created_at_idx')
    .on('comments')
    .columns(['post_id', 'created_at'])
    .execute()

  // Foreign keys
  await schema
    .alterTable('refresh_tokens')
    .addForeignKeyConstraint('refresh_token_user_id_fk', ['user_id'], 'users', ['user_id'], fk =>
      fk.onDelete('cascade')
    )
    .execute()

  await schema
    .alterTable('posts')
    .addForeignKeyConstraint('post_user_id_fk', ['user_id'], 'users', ['user_id'], fk =>
      fk.onDelete('cascade')
    )
    .execute()

  await schema
    .alterTable('comments')
    .addForeignKeyConstraint('comment_user_id_fk', ['user_id'], 'users', ['user_id'], fk =>
      fk.onDelete('cascade')
    )
    .execute()

  await schema
    .alterTable('comments')
    .addForeignKeyConstraint('comment_post_id_fk', ['post_id'], 'posts', ['post_id'], fk =>
      fk.onDelete('cascade')
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  const { schema } = db;

  // Drop tables
  await schema.dropTable('comments').cascade().execute()
  await schema.dropTable('posts').cascade().execute()
  await schema.dropTable('refresh_tokens').cascade().execute()
  await schema.dropTable('users').cascade().execute()

  // Drop types
  await schema.dropType('language_enum').execute()
  await schema.dropType('post_type_enum').execute()
  await schema.dropType('post_status_enum').execute()
  await schema.dropType('user_role_enum').execute()

  await sql.raw('DROP EXTENSION ltree').execute(db)
}
