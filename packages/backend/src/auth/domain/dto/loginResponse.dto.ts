import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty()
  accessToken: string;

  static from(accessToken: string): LoginResponseDto {
    const dto = new LoginResponseDto()
    dto.accessToken = accessToken;
    return dto;
  }
}
