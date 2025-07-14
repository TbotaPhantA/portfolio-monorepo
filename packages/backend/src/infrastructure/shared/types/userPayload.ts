import { UserRoleEnum } from '../../../auth/domain/enums/userRole.enum';

export class UserPayload {
  userId: number;
  jwtTokensVersion: number;
  roles: UserRoleEnum[];
  username: string;
}
