import {
  CanActivate,
  ExecutionContext, ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { UserRoleEnum } from '../../domain/enums/userRole.enum';
import assert from 'node:assert';
import { doIntersect } from '../../../infrastructure/shared/utils/doIntersect';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly availableRoles: UserRoleEnum[]) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request['user'];
    assert.ok(user, 'No user in request!');
    if (!doIntersect(user.roles, this.availableRoles)) {
      throw new ForbiddenException()
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
