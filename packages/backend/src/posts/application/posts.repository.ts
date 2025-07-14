/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Database } from '../../infrastructure/db/db.schema';
import { Kysely } from 'kysely';
import { Post } from '../domain/post/post';
import { InjectKysely } from 'nestjs-kysely';
import { SearchPostsParams } from '../domain/dto/search/searchPostsParamDto';
import { SearchPostsResponseDto } from '../domain/dto/search/searchPostsResponseDto';

@Injectable()
export class PostsRepository {
  constructor(@InjectKysely() private readonly db: Kysely<Database>) {}

  async searchPosts(search: SearchPostsParams): Promise<SearchPostsResponseDto> {
    let query = this.db
      .selectFrom('posts')
      .select([
        'postId',
        'userId',
        'status',
        'type',
        'language',
        'createdAt',
        'title',
        'body',
        'tags',
      ])

    if (search.filter.language) {
      query = query.where('language', '=', search.filter.language)
    }    

    if (search.postIdCursor) {
      query = query.where('postId', '>', search.postIdCursor);
    }

    query = query
      .orderBy('postId', 'desc')
      .limit(search.limit)

    const rows = await query.execute();

    return SearchPostsResponseDto.from(rows);
  }

  async insertAndFillInPost(post: Post): Promise<void> {
    const result = await this.db
      .insertInto('posts')
      .values({
        userId: post.userId,
        status: post.status,
        type: post.type,
        language: post.language,
        title: post.title,
        body: post.body,
        tags: post.tags,
      })
      .returning(['postId', 'createdAt'])
      .executeTakeFirstOrThrow();

    post.postId = result.postId;
    post.createdAt = result.createdAt;
  }
}
