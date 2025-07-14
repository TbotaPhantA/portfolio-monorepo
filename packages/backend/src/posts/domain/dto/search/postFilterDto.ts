import { IsEnum, IsOptional } from 'class-validator';
import { LanguageEnum } from '../../enums/language.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PostFilterDto {
  @IsOptional()
  @IsEnum(LanguageEnum)
  @ApiPropertyOptional({ example: LanguageEnum.EN })
  language?: LanguageEnum;
}
