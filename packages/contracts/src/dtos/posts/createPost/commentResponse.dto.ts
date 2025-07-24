import { ApiProperty } from '@nestjs/swagger';

export class CommentResponseDto {
  @ApiProperty({ example: 1 })
  commentId!: number;

  @ApiProperty({ example: 1 })
  postId!: number;

  @ApiProperty({ example: 1 })
  userId!: number;

  @ApiProperty({ example: new Date(2022, 0, 3) })
  createdAt!: Date;

  @ApiProperty({ example: '1.1' })
  path!: string;

  @ApiProperty({ example: 'test comment' })
  body!: string;

  static fromMany(rawComments: CommentResponseDto[]) {
    return rawComments.map(raw => {
      const dto = new CommentResponseDto()

      dto.commentId = raw.commentId;
      dto.postId = raw.postId;
      dto.userId = raw.userId;
      dto.createdAt = raw.createdAt;
      dto.path = raw.path;
      dto.body = raw.body;

      return dto;
    })
  }
}
