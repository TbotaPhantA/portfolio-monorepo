import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '../../post/comment/comment';

export class CommentResponseDto {
  @ApiProperty({ example: 1 })
  commentId: number;

  @ApiProperty({ example: 1 })
  postId: number;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: new Date(2022, 0, 3) })
  createdAt: Date;

  @ApiProperty({ example: '1.1' })
  path: string;

  @ApiProperty({ example: 'test comment'})
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
