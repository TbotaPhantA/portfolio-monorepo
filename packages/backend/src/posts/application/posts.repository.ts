import { Injectable } from '@nestjs/common';
import { Database } from '../../infrastructure/db/db.schema';
import { Kysely } from 'kysely';
import { Post } from '../domain/post/post';
import { InjectKysely } from 'nestjs-kysely';
import { SearchPostsParams } from '../domain/dto/search/searchPostsParamDto';
import { SearchPostsResponseDto } from '../domain/dto/search/searchPostsResponseDto';
import { jsonArrayFrom } from 'kysely/helpers/postgres';
import { Comment } from '../domain/post/comment/comment';

@Injectable()
export class PostsRepository {
  constructor(@InjectKysely() private readonly db: Kysely<Database>) {}

  async findOneById(postId: number): Promise<Post | null> {
    const query = this.db
      .selectFrom('posts')
      .select((eb) => {
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
          jsonArrayFrom(
            eb
              .selectFrom('comments')
              .select([
                'comments.commentId',
                'comments.postId',
                'comments.userId',
                'comments.createdAt',
                'comments.path',
                'comments.body',
              ])
              .whereRef('comments.postId', '=', 'posts.postId'),
          ).as('comments'),
        ];
      })
      .where('posts.postId', '=', postId)
      .groupBy('posts.postId');

    const post = await query.executeTakeFirst();

    if (!post) return null;

    return new Post({
      ...post,
      comments: post.comments.map((comment) => new Comment(comment)),
    });
  }

  async searchPosts(
    search: SearchPostsParams,
  ): Promise<SearchPostsResponseDto> {
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
      ]);

    if (search.filter.language) {
      query = query.where('language', '=', search.filter.language);
    }

    if (search.postIdCursor) {
      query = query.where('postId', '>', search.postIdCursor);
    }

    query = query.orderBy('postId', 'desc').limit(search.limit);

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
      .execute();
  }
}
