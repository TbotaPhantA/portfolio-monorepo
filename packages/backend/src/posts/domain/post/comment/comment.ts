import { NoMethods } from '../../../../infrastructure/shared/types/noMethods';
import { CreateCommentDto } from '../../dto/createPost/createComment.dto';
import { PLACEHOLDER_DATE, PLACEHOLDER_ID } from '../../../../infrastructure/shared/constants';
import type { User } from '../../../../auth/domain/user/user';

export class Comment {
  commentId: number;
  postId: number;
  userId: number;
  createdAt: Date;
  path: string;
  body: string;

  constructor(raw: NoMethods<Comment>) {
    this.commentId = raw.commentId;
    this.postId = raw.postId;
    this.userId = raw.userId;
    this.createdAt = raw.createdAt;
    this.path = raw.path;
    this.body = raw.body;
  }

  static createByDto(dto: CreateCommentDto, user: Pick<User, 'userId'>): Comment {
    return new Comment({
      commentId: PLACEHOLDER_ID,
      postId: PLACEHOLDER_ID,
      userId: user.userId,
      createdAt: PLACEHOLDER_DATE,
      path: dto.path,
      body: dto.body,
    })
  }
}
