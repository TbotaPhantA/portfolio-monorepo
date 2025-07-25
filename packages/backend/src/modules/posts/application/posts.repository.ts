import { Injectable } from '@nestjs/common';
import { Post } from '../domain/post/post';
import { jsonArrayFrom } from 'kysely/helpers/postgres';
import { Comment } from '../domain/post/comment/comment';
import { TransactionHost } from '@nestjs-cls/transactional';
import {
  SearchPostsParams,
  SearchPostsResponseDto,
} from '@portfolio/contracts';
import { Span, TraceService } from 'nestjs-otel';
import { KyselyCLS } from '../../../infrastructure/shared/types/kyselyCLS';

@Injectable()
export class PostsRepository {
  constructor(
    private readonly db: TransactionHost<KyselyCLS>,
    private readonly traceService: TraceService,
  ) {}

  @Span()
  async findOneById(postId: number): Promise<Post | null> {
    const query = this.db.tx
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

    this.traceService.getSpan()?.addEvent('sql', { sql: query.compile().sql });

    const post = await query.executeTakeFirst();

    if (!post) return null;

    return new Post({
      ...post,
      comments: post.comments.map(
        (comment) =>
          new Comment({
            ...comment,
            createdAt: new Date(Date.parse(comment.createdAt)),
          }),
      ),
    });
  }

  @Span()
  async searchPosts(
    search: SearchPostsParams,
  ): Promise<SearchPostsResponseDto> {
    let query = this.db.tx
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

    this.traceService.getSpan()?.addEvent('sql', { sql: query.compile().sql });

    const rows = await query.execute();

    return SearchPostsResponseDto.fromMany(
      rows.map((row) => ({ ...row, comments: [] })),
    );
  }

  @Span()
  async insertAndFillInPost(post: Post): Promise<void> {
    const query = this.db.tx
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
      .returning(['postId', 'createdAt']);

    this.traceService.getSpan()?.addEvent('sql', { sql: query.compile().sql });

    const result = await query.executeTakeFirstOrThrow();

    post.postId = result.postId;
    post.createdAt = result.createdAt;
  }

  @Span()
  async update(post: Post): Promise<void> {
    const changes = post.changes();

    if (Object.keys(changes).length === 0) return;

    const query = this.db.tx
      .updateTable('posts')
      .where('posts.postId', '=', post.postId)
      .set(changes);

    this.traceService.getSpan()?.addEvent('sql', { sql: query.compile().sql });

    await query.execute();
  }
}
