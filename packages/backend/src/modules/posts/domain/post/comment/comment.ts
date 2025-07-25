import { NoMethods } from '../../../../infrastructure/shared/types/noMethods';

type RawComment = NoMethods<Comment>;

export class Comment {
  commentId: number;
  postId: number;
  userId: number;
  createdAt: Date;
  path: string;
  body: string;

  constructor(raw: RawComment) {
    this.commentId = raw.commentId;
    this.postId = raw.postId;
    this.userId = raw.userId;
    this.createdAt = raw.createdAt;
    this.path = raw.path;
    this.body = raw.body;
  }
}
