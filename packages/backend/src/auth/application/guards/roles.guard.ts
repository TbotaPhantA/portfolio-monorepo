import {
  CanActivate,
  ExecutionContext, ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserRoleEnum } from '../../domain/enums/userRole.enum';
import * as assert from 'node:assert';
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
}
