import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { jwtVerifyAsync } from '../../../infrastructure/shared/utils/jwtVerifyAsync';
import { config } from '../../../infrastructure/config/config';
import { ClsService } from 'nestjs-cls';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import * as assert from 'node:assert';
import { ClsStoreMap } from '../../../infrastructure/shared/types/clsStoreMap';
import { UserPayload } from '@portfolio/contracts';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly cls: ClsService<ClsStoreMap>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const userPayload = await jwtVerifyAsync(
        token,
        config.auth.accessToken.privateKey,
      );
      const payloadInstance = plainToInstance(UserPayload, userPayload);
      const validationErrors = await validate(payloadInstance);
      assert.ok(validationErrors.length === 0);
      this.cls.set('user', payloadInstance);
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
