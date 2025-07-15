import { PostStatusEnum } from '../enums/postStatus.enum';
import { PostTypeEnum } from '../enums/postType.enum';
import { LanguageEnum } from '../enums/language.enum';
import type { NoMethods } from '../../../infrastructure/shared/types/noMethods';
import { Comment } from './comment/comment';
import { CreatePostDto } from '../dto/createPost/createPost.dto';
import {
  PLACEHOLDER_DATE,
  PLACEHOLDER_ID,
} from '../../../infrastructure/shared/constants';
import { UserPayload } from '../../../infrastructure/shared/types/userPayload';

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

  constructor(raw: NoMethods<Post>) {
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
}
