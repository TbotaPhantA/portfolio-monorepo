import { Generated } from 'kysely';

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
  userId: Generated<number>;
  jwtTokensVersion: number;
  roles: UserRoleEnum[];
  username: string;
  salt: Buffer;
  passwordHash: Buffer;
}

export interface RefreshTokens {
  refreshTokenId: Generated<number>;
  userId: number;
  expiresAt: Date;
  token: string;
}

export interface Posts {
  postId: Generated<number>;
  userId: number;
  status: PostStatusEnum;
  type: PostTypeEnum;
  language: LanguageEnum;
  createdAt: Generated<Date>;
  title: string;
  body: string;
  tags: string[];
}

export interface Comments {
  commentId: Generated<number>;
  postId: number;
  userId: number;
  createdAt: Generated<Date>;
  path: string; // ltree represented as string
  body: string;
}

/**
 * Database interface
 */
export interface Database {
  users: Users;
  refreshTokens: RefreshTokens;
  posts: Posts;
  comments: Comments;
}
