import { Controller, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('/login')
  async login() {}
  /**
   * 1. /auth/login
   * 2. /auth/refresh
   * 3. /auth/logout
   */
}
