import { InjectionBuilder } from 'ts-fixture-builder';
import { Comment } from '../../../../src/posts/domain/post/comment/comment';
import { PLACEHOLDER_DATE, PLACEHOLDER_ID } from '../../../../src/infrastructure/shared/constants';

export class CommentBuilder {
  static get defaultPreInserted(): InjectionBuilder<Comment> {
    return new InjectionBuilder<Comment>(new Comment({
      commentId: PLACEHOLDER_ID,
      postId: PLACEHOLDER_ID,
      userId: 1,
      createdAt: PLACEHOLDER_DATE,
      path: 'path',
      body: 'body',
    }));
  }
}
