import { UserRoleEnum } from '../enums/userRole.enum';
import { NoMethods } from '../../../infrastructure/shared/types/noMethods';
import { RefreshToken } from './refreshToken/refreshToken';
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'smallint', name: 'user_id' })
  userId: number;

  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    name: 'role',
    nullable: false,
  })
  role: UserRoleEnum;

  @Column({
    type: 'smallint',
    name: 'access_tokens_version',
    default: () => '1',
  })
  accessTokensVersion: number;

  @Column({
    type: 'varchar',
    length: 31,
    unique: true,
    nullable: false,
  })
  username: string;

  @Column({ type: 'varchar', nullable: false })
  salt: string;

  @Column({ type: 'varchar', name: 'password_hash', nullable: false })
  passwordHash: string;

  @OneToMany(() => RefreshToken, rt => rt.userId)
  @JoinColumn({ name: 'user_id' })
  refreshTokens: RefreshToken[];

  constructor(raw: NoMethods<User>) {
    this.userId = raw.userId;
    this.role = raw.role;
    this.accessTokensVersion = raw.accessTokensVersion;
    this.username = raw.username;
    this.salt = raw.salt;
    this.passwordHash = raw.passwordHash;
    this.refreshTokens = raw.refreshTokens;
  }
}
