import { InjectionBuilder } from 'ts-fixture-builder';
import { Post } from '../../../../src/posts/domain/post/post';
import { PostStatusEnum } from '../../../../src/posts/domain/enums/postStatus.enum';
import { PostTypeEnum } from '../../../../src/posts/domain/enums/postType.enum';
import { LanguageEnum } from '../../../../src/posts/domain/enums/language.enum';
import {
  PLACEHOLDER_DATE,
  PLACEHOLDER_ID,
} from '../../../../src/infrastructure/shared/constants';

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
