import { LanguageEnum, PostStatusEnum, PostTypeEnum } from '../../../enums';
import { CommentResponseDto } from './commentResponse.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PostResponseDto {
  @ApiProperty({ example: 1 })
  postId!: number;

  @ApiProperty({ example: 1 })
  userId!: number;

  @ApiProperty({ example: PostStatusEnum.DRAFT })
  status!: PostStatusEnum;

  @ApiProperty({ example: PostTypeEnum.ARTICLE })
  type!: PostTypeEnum;

  @ApiProperty({ example: LanguageEnum.EN })
  language!: LanguageEnum;

  @ApiProperty({ example: new Date(2022, 0, 3) })
  createdAt!: Date;

  @ApiProperty({ example: 'test title' })
  title!: string;

  @ApiProperty({ example: 'test body' })
  body!: string;

  @ApiProperty({ example: ['test tag'] })
  tags!: string[];

  @ApiProperty({ type: [CommentResponseDto] })
  comments!: CommentResponseDto[];

  static from(raw: PostResponseDto): PostResponseDto {
    const dto = new PostResponseDto();

    dto.postId = raw.postId;
    dto.userId = raw.userId;
    dto.status = raw.status;
    dto.type = raw.type;
    dto.language = raw.language;
    dto.createdAt = raw.createdAt;
    dto.title = raw.title;
    dto.body = raw.body;
    dto.tags = raw.tags;
    dto.comments = CommentResponseDto.fromMany(raw.comments);

    return dto;
  }

  static fromMany(rawPosts: PostResponseDto[]): PostResponseDto[] {
    return rawPosts.map(PostResponseDto.from);
  }
}
