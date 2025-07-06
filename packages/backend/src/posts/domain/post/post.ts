import { PostStatusEnum } from '../enums/postStatus.enum';
import { PostTypeEnum } from '../enums/postType.enum';
import { LanguageEnum } from '../enums/language.enum';
import type { NoMethods } from '../../../infrastructure/shared/types/noMethods';
import { Comment } from './comment/comment';

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
}
