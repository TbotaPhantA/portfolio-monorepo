import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { LoginDto, LoginResponseDto } from '@portfolio/contracts';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('/login')
  @ApiResponse({ type: LoginResponseDto })
  login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<LoginResponseDto> {
    return this.auth.login(dto, reply);
  }
  /**
   * 1. /auth/login
   * 2. /auth/refresh
   * 3. /auth/logout
   */
}
