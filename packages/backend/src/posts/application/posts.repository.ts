import { Injectable } from '@nestjs/common';
import { Database } from '../../infrastructure/db/db.schema';
import { Kysely } from 'kysely';
import { Post } from '../domain/post/post';
import { InjectKysely } from 'nestjs-kysely';

@Injectable()
export class PostsRepository {
  constructor(@InjectKysely() private readonly db: Kysely<Database>) {}

  async insertAndFillInPost(post: Post): Promise<void> {
    const result = await this.db
      .insertInto('posts')
      .values({
        user_id: post.userId,
        status: post.status,
        type: post.type,
        language: post.language,
        title: post.title,
        body: post.body,
        tags: post.tags,
      })
      .returning(['post_id', 'created_at'])
      .executeTakeFirstOrThrow()

    post.postId = result.post_id;
    post.createdAt = result.created_at;
  }
}
