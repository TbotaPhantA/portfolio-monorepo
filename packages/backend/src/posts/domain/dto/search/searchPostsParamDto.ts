import { ApiProperty } from '@nestjs/swagger';
import { PostFilterDto } from './postFilterDto';
import { PostPaginationDto } from './postPaginationDto';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchPostsParams extends PostPaginationDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PostFilterDto)
  @ApiProperty({ type: PostFilterDto })
  filter: PostFilterDto;
}
