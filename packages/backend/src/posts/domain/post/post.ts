import type { NoMethods } from '../../../infrastructure/shared/types/noMethods';
import { Comment } from './comment/comment';
import {
  PLACEHOLDER_DATE,
  PLACEHOLDER_ID,
} from '../../../infrastructure/shared/constants';
import { ForbiddenException } from '@nestjs/common';
import * as assert from 'node:assert';
import * as _ from 'lodash';
import { objectDiff } from '../../../infrastructure/shared/utils/objectDiff';
import {
  CreatePostDto,
  LanguageEnum,
  PostStatusEnum,
  PostTypeEnum,
  UpdatePostDto,
  UserPayload,
} from '@portfolio/contracts';

type RawPost = NoMethods<Post>;

export class Post {
  postId: number;
  userId: number;
  status: PostStatusEnum;
  type: PostTypeEnum;
  language: LanguageEnum;
  createdAt: Date;
  title: string;
  body: string;
  tags: string[];
  comments: Comment[];
  #original: Post;

  constructor(raw: RawPost) {
    this.postId = raw.postId;
    this.userId = raw.userId;
    this.status = raw.status;
    this.type = raw.type;
    this.language = raw.language;
    this.createdAt = raw.createdAt;
    this.title = raw.title;
    this.body = raw.body;
    this.tags = raw.tags;
    this.comments = raw.comments;
    this.#original = _.cloneDeep(this);
  }

  static createByDto(dto: CreatePostDto, user: UserPayload): Post {
    return new Post({
      postId: PLACEHOLDER_ID,
      userId: user.userId,
      status: dto.status,
      type: dto.type,
      language: dto.language,
      createdAt: PLACEHOLDER_DATE,
      title: dto.title,
      body: dto.body,
      tags: dto.tags,
      comments: [],
    });
  }

  updateByDto(dto: UpdatePostDto, user: UserPayload): void {
    assert.ok(user.userId === this.userId, new ForbiddenException());

    this.status = dto.status;
    this.type = dto.type;
    this.title = dto.title;
    this.body = dto.body;
    this.tags = dto.tags;
  }

  changes(): Partial<RawPost> {
    return objectDiff(this, this.#original);
  }
}
