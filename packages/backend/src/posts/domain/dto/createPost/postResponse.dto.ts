import { PostStatusEnum } from '../../enums/postStatus.enum';
import { PostTypeEnum } from '../../enums/postType.enum';
import { LanguageEnum } from '../../enums/language.enum';
import { CommentResponseDto } from './commentResponse.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../../post/post';

export class PostResponseDto {
  @ApiProperty()
  postId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  status: PostStatusEnum;

  @ApiProperty()
  type: PostTypeEnum;

  @ApiProperty()
  language: LanguageEnum;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  comments: CommentResponseDto[];

  static from(post: Post): PostResponseDto {
    const dto = new PostResponseDto()

    dto.postId = post.postId;
    dto.userId = post.userId;
    dto.status = post.status;
    dto.type = post.type;
    dto.language = post.language;
    dto.createdAt = post.createdAt;
    dto.title = post.title;
    dto.body = post.body;
    dto.tags = post.tags;
    dto.comments = post.comments.map(c => CommentResponseDto.from(c));

    return dto;
  }
}
