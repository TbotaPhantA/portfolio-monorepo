/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Database } from '../../infrastructure/db/db.schema';
import { Kysely, sql } from 'kysely';
import { Post } from '../domain/post/post';
import { InjectKysely } from 'nestjs-kysely';
import { SearchPostsParams } from '../domain/dto/search/searchPostsParamDto';
import { SearchPostsResponseDto } from '../domain/dto/search/searchPostsResponseDto';
import { jsonBuildObject } from 'kysely/helpers/postgres';
import { Comment } from '../domain/post/comment/comment';

@Injectable()
export class PostsRepository {
  constructor(@InjectKysely() private readonly db: Kysely<Database>) {}

  async findOneById(postId: number): Promise<Post | null> {
    const post = await this.db
      .selectFrom('posts')
      .leftJoin('comments', 'posts.postId', 'comments.postId')
      .select(({ fn, ref }) => {
        return [
        'posts.postId',
        'posts.userId',
        'posts.status',
        'posts.type',
        'posts.language',
        'posts.createdAt',
        'posts.title',
        'posts.body',
        'posts.tags',
          fn
            .coalesce(
              fn
                .jsonAgg(
                  jsonBuildObject({
                    commentId: ref('comments.commentId'),
                    postId: ref('comments.postId'),
                    userId: ref('comments.userId'),
                    createdAt: ref('comments.createdAt'),
                    path: ref('comments.path'),
                    body: ref('comments.body'),
                  }),
                )
                .filterWhere('comments.commentId', 'is not', null),
              sql<never[]>`'[]'`,
            )
            .as('comments'),
        ]
      })
      .where('posts.postId', '=', postId)
      .groupBy('posts.postId')
      .executeTakeFirst()

      if (!post) return null;

      const comments = post.comments.map(p => new Comment({
        commentId: p.commentId!,
        postId: p.postId!,
        userId: p.userId!,
        createdAt: p.createdAt!,
        path: p.path!,
        body: p.body!,
      }));

      return new Post({ ...post, comments });
  }

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

  async update(post: Post): Promise<void> {
    const changes = post.changes();   

    await this.db
      .updateTable('posts')
      .where('posts.postId', '=', post.postId)
      .set(changes)
      .execute()
  }
}
