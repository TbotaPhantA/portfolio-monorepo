import { NoMethods } from '../../../../infrastructure/shared/types/noMethods';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'refresh_tokens' })
export class RefreshToken {
  @PrimaryGeneratedColumn({ type: 'smallint', name: 'refresh_token_id' })
  refreshTokenId: number;

  @Column({ type: 'smallint', name: 'user_id' })
  userId: number;

  @Column({ type: 'timestamp', name: 'expires_at' })
  expiresAt: Date;

  @Column({ type: 'varchar', nullable: false })
  token: string;

  constructor(raw: NoMethods<RefreshToken>) {
    this.refreshTokenId = raw.refreshTokenId;
    this.userId = raw.userId;
    this.expiresAt = raw.expiresAt;
    this.token = raw.token;
  }
}

