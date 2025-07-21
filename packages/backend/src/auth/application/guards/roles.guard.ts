import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as assert from 'node:assert';
import { doIntersect } from '../../../infrastructure/shared/utils/doIntersect';
import { ClsService } from 'nestjs-cls';
import { ClsStoreMap } from '../../../infrastructure/shared/types/clsStoreMap';
import { Reflector } from '@nestjs/core';
import { UserRoleEnum } from '../../domain/enums/userRole.enum';
import { ROLES_KEY } from '../decorators/roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly cls: ClsService<ClsStoreMap>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const availableRoles =
      this.reflector.get<UserRoleEnum[]>(ROLES_KEY, context.getHandler()) || [];
    console.log({ availableRoles })
    const user = this.cls.get('user');
    assert.ok(user, 'No user in request!');
    if (!doIntersect(user.roles, availableRoles)) {
      throw new ForbiddenException();
    }
    return true;
  }
}
