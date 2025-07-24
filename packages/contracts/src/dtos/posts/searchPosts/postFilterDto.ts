import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { LanguageEnum } from '../../../enums';

export class PostFilterDto {
  @IsOptional()
  @IsEnum(LanguageEnum)
  @ApiPropertyOptional({ example: LanguageEnum.EN })
  language?: LanguageEnum;
}
