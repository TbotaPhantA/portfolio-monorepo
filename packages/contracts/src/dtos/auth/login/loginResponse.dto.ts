import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 'some access token' })
  accessToken!: string;

  static from(raw: LoginResponseDto): LoginResponseDto {
    const dto = new LoginResponseDto();
    dto.accessToken = raw.accessToken;
    return dto;
  }
}
