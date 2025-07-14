import { UserRoleEnum } from '../../domain/enums/userRole.enum';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export function Authentication(availableRoles: UserRoleEnum[]) {
  return UseGuards(AuthGuard, new RolesGuard(availableRoles));
}
