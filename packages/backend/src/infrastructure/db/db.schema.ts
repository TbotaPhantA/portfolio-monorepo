import { Generated } from 'kysely'

/**
 * Enum definitions matching DB enums
 */
export enum UserRoleEnum {
  ADMIN = 'ADMIN',
  VISITOR = 'VISITOR',
}

export enum PostStatusEnum {
  DRAFT = 'DRAFT',
  PUBLIC = 'PUBLIC',
}

export enum PostTypeEnum {
  ARTICLE = 'ARTICLE',
  BOOK_REVIEW = 'BOOK_REVIEW',
}

export enum LanguageEnum {
  EN = 'EN',
  RU = 'RU',
}

/**
 * Table definitions
 */
export interface Users {
  user_id: Generated<number>
  jwt_tokens_version: number
  roles: UserRoleEnum[]
  username: string
  salt: Buffer
  password_hash: Buffer
}

export interface RefreshTokens {
  refresh_token_id: Generated<number>
  user_id: number
  expires_at: Date
  token: string
}

export interface Posts {
  post_id: Generated<number>
  user_id: number
  status: PostStatusEnum
  type: PostTypeEnum
  language: LanguageEnum
  created_at: Date
  title: string
  body: string
  tags: string[]
}

export interface Comments {
  comment_id: Generated<number>
  post_id: number
  user_id: number
  created_at: Date
  path: string // ltree represented as string
  body: string
}

/**
 * Database interface
 */
export interface Database {
  users: Users
  refresh_tokens: RefreshTokens
  posts: Posts
  comments: Comments
}

