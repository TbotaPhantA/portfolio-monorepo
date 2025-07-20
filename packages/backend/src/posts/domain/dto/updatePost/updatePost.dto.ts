import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PostStatusEnum } from '../../enums/postStatus.enum';
import { PostTypeEnum } from '../../enums/postType.enum';
import { MAX_INT_4 } from '../../../../infrastructure/shared/constants';

export class UpdatePostDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(MAX_INT_4)
  @ApiProperty({ example: 1 })
  postId: number;

  @IsNotEmpty()
  @IsEnum(PostStatusEnum)
  @ApiProperty({ example: PostStatusEnum.DRAFT })
  status: PostStatusEnum;

  @IsNotEmpty()
  @IsEnum(PostTypeEnum)
  @ApiProperty({ example: PostTypeEnum.ARTICLE })
  type: PostTypeEnum;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'test title' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'test body' })
  body: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ example: ['test tag'] })
  tags: string[];
}
