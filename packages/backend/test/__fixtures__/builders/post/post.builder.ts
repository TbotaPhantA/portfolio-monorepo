import { InjectionBuilder } from 'ts-fixture-builder';
import {
  PLACEHOLDER_DATE,
  PLACEHOLDER_ID,
} from '../../../../src/infrastructure/shared/constants';
import {
  LanguageEnum,
  PostStatusEnum,
  PostTypeEnum,
} from '@portfolio/contracts';
import { Post } from '../../../../src/modules/posts/domain/post/post';

export class PostBuilder {
  static get defaultPreInserted(): InjectionBuilder<Post> {
    return new InjectionBuilder<Post>(
      new Post({
        postId: PLACEHOLDER_ID,
        userId: 1,
        status: PostStatusEnum.DRAFT,
        type: PostTypeEnum.ARTICLE,
        language: LanguageEnum.EN,
        createdAt: PLACEHOLDER_DATE,
        title: 'title',
        body: 'body',
        tags: ['tag1'],
        comments: [],
      }),
    );
  }

  static get defaultAll(): InjectionBuilder<Post> {
    return new InjectionBuilder<Post>(
      new Post({
        postId: 1,
        userId: 1,
        status: PostStatusEnum.DRAFT,
        type: PostTypeEnum.ARTICLE,
        language: LanguageEnum.EN,
        createdAt: new Date(2022, 0, 3),
        title: 'title',
        body: 'body',
        tags: ['tag1'],
        comments: [],
      }),
    );
  }
}
