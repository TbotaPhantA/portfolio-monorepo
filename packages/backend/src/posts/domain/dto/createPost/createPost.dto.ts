import { PostStatusEnum } from '../../enums/postStatus.enum';
import { PostTypeEnum } from '../../enums/postType.enum';
import { LanguageEnum } from '../../enums/language.enum';
import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @IsNotEmpty()
  @IsEnum(PostStatusEnum)
  @ApiProperty()
  status: PostStatusEnum;

  @IsNotEmpty()
  @IsEnum(PostTypeEnum)
  @ApiProperty()
  type: PostTypeEnum;

  @IsNotEmpty()
  @IsEnum(LanguageEnum)
  @ApiProperty()
  language: LanguageEnum;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  body: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty()
  tags: string[];
}
