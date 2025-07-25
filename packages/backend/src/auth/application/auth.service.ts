import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user/user.repository';
import { USERNAME_OR_PASSWORD_IS_NOT_VALID } from '../../infrastructure/shared/constants';
import { User } from '../domain/user/user';
import { config } from '../../infrastructure/config/config';
import { FastifyReply } from 'fastify';
import { LoginDto, LoginResponseDto } from '@portfolio/contracts';
import { Span } from 'nestjs-otel';

@Injectable()
export class AuthService {
  constructor(private readonly repo: UserRepository) {}

  @Span()
  async login(dto: LoginDto, reply: FastifyReply): Promise<LoginResponseDto> {
    const user = await this.getByUsername(dto.username);
    const { accessToken, refreshToken } = await user.login(
      dto.password,
      config.auth,
    );
    await this.repo.insertRefreshTokens(user.refreshTokens.slice(-1));
    this.addRefreshTokenToCookies(refreshToken, reply);
    return LoginResponseDto.from({ accessToken });
  }

  private async getByUsername(username: string): Promise<User> {
    const user = await this.repo.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException(USERNAME_OR_PASSWORD_IS_NOT_VALID);
    }

    return user;
  }

  private addRefreshTokenToCookies(refreshToken: string, reply: FastifyReply) {
    reply.setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'prod',
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: config.auth.refreshToken.expiryInSeconds,
    });
  }
}
