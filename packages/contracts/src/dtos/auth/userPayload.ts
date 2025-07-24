import { IsEnum, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { UserRoleEnum } from '../../enums/userRole.enum';
import { MAX_INT_4 } from '../../shared';

export class UserPayload {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(MAX_INT_4)
  userId!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(MAX_INT_4)
  jwtTokensVersion!: number;

  @IsNotEmpty()
  @IsEnum(UserRoleEnum, { each: true })
  roles!: UserRoleEnum[];

  @IsNotEmpty()
  @IsString()
  username!: string;
}
