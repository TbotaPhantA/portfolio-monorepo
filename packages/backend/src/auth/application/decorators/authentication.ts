import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export function AuthGuards() {
  return UseGuards(AuthGuard, RolesGuard);
}
