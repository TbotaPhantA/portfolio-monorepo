import { PostStatusEnum } from '../enums/postStatus.enum';
import { PostTypeEnum } from '../enums/postType.enum';
import { LanguageEnum } from '../enums/language.enum';
import type { NoMethods } from '../../../infrastructure/shared/types/noMethods';
import { Comment } from './comment/comment';
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn({ type: 'smallint', name: 'post_id' })
  postId: number;

  @Column({ type: 'smallint', name: 'user_id' })
  userId: number;

  @Column({ type: 'enum', enum: PostStatusEnum, nullable: false })
  status: PostStatusEnum;

  @Column({ type: 'enum', enum: PostTypeEnum, nullable: false })
  type: PostTypeEnum;

  @Column({ type: 'enum', enum: LanguageEnum, nullable: false })
  language: LanguageEnum;

  @Column({
    type: 'timestamptz',
    name: 'created_at',
    default: () => 'now()',
  })
  createdAt: Date;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  body: string;

  @Column('text', { array: true, nullable: true })
  tags: string[];

  @OneToMany(() => Comment, rt => rt.postId)
  @JoinColumn({ name: 'post_id' })
  comments: Comment[];

  constructor(raw: NoMethods<Post>) {
    this.postId = raw.postId;
    this.userId = raw.userId;
    this.status = raw.status;
    this.type = raw.type;
    this.language = raw.language;
    this.createdAt = raw.createdAt;
    this.title = raw.title;
    this.body = raw.body;
    this.tags = raw.tags;
    this.comments = raw.comments;
  }
}
