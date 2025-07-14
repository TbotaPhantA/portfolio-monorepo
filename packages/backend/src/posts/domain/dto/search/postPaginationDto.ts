import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';
import { MAX_INT_4 } from '../../../../infrastructure/shared/constants';

export class PostPaginationDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(100)
  @ApiProperty({ example: 10 })
  limit: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(MAX_INT_4)
  @ApiPropertyOptional({ example: 1 })
  postIdCursor?: number;
}
