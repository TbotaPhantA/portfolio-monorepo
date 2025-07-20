import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserRoleEnum } from '../../domain/enums/userRole.enum';
import * as assert from 'node:assert';
import { doIntersect } from '../../../infrastructure/shared/utils/doIntersect';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly availableRoles: UserRoleEnum[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = request['user'];
    assert.ok(user, 'No user in request!');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!doIntersect(user.roles, this.availableRoles)) {
      throw new ForbiddenException();
    }
    return true;
  }
}
