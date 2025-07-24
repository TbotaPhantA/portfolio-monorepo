import { Body, Controller, Post, Res } from '@nestjs/common';
import { LoginDto } from '../domain/dto/login.dto';
import { LoginResponseDto } from '../domain/dto/loginResponse.dto';
import { AuthService } from './auth.service';
import { ApiResponse } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

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
