import { PostStatusEnum } from '../../enums/postStatus.enum';
import { PostTypeEnum } from '../../enums/postType.enum';
import { LanguageEnum } from '../../enums/language.enum';
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @IsNotEmpty()
  @IsEnum(PostStatusEnum)
  @ApiProperty({ example: PostStatusEnum.DRAFT })
  status: PostStatusEnum;

  @IsNotEmpty()
  @IsEnum(PostTypeEnum)
  @ApiProperty({ example: PostTypeEnum.ARTICLE })
  type: PostTypeEnum;

  @IsNotEmpty()
  @IsEnum(LanguageEnum)
  @ApiProperty({ example: LanguageEnum.EN })
  language: LanguageEnum;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'test title' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'test body'})
  body: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ example: ['test tag']})
  tags: string[];
}
