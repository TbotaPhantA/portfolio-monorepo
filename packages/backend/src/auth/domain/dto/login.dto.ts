import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  @ApiProperty({ example: 'admin' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'admin' })
  password: string;
}
