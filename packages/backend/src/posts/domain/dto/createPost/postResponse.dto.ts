import { PostStatusEnum } from '../../enums/postStatus.enum';
import { PostTypeEnum } from '../../enums/postType.enum';
import { LanguageEnum } from '../../enums/language.enum';
import { CommentResponseDto } from './commentResponse.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../../post/post';

export class PostResponseDto {
  @ApiProperty({ example: 1 })
  postId: number;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: PostStatusEnum.DRAFT })
  status: PostStatusEnum;

  @ApiProperty({ example: PostTypeEnum.ARTICLE })
  type: PostTypeEnum;

  @ApiProperty({ example: LanguageEnum.EN })
  language: LanguageEnum;

  @ApiProperty({ example: new Date(2022, 0, 3)})
  createdAt: Date;

  @ApiProperty({ example: 'test title' })
  title: string;

  @ApiProperty({ example: 'test body'})
  body: string;

  @ApiProperty({ example: ['test tag'] })
  tags: string[];

  @ApiProperty({ type: [CommentResponseDto] })
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
