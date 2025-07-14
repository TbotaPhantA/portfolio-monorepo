import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '../../post/comment/comment';

export class CommentResponseDto {
  @ApiProperty()
  commentId: number;

  @ApiProperty()
  postId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  path: string;

  @ApiProperty()
  body: string;

  static from(comment: Comment) {
    const dto = new CommentResponseDto();

    dto.commentId = comment.commentId;
    dto.postId = comment.postId;
    dto.userId = comment.userId;
    dto.createdAt = comment.createdAt;
    dto.path  = comment.path;
    dto.body  = comment.body;

    return dto;
  }
}
