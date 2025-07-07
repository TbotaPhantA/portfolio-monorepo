import { NoMethods } from '../../../../infrastructure/shared/types/noMethods';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn({ type: 'smallint', name: 'comment_id' })
  commentId: number;

  @Column({ type: 'smallint', name: 'post_id' })
  postId: number;

  @Column({ type: 'smallint', name: 'user_id' })
  userId: number;

  @Column({
    type: 'timestamptz',
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;

  @Column({ type: 'ltree', nullable: false })
  path: string;

  @Column({ type: 'text', nullable: false })
  body: string;

  constructor(raw: NoMethods<Comment>) {
    this.commentId = raw.commentId;
    this.postId = raw.postId;
    this.userId = raw.userId;
    this.createdAt = raw.createdAt;
    this.path = raw.path;
    this.body = raw.body;
  }
}
