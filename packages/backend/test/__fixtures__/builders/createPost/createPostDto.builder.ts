import { InjectionBuilder } from 'ts-fixture-builder';
import { CreatePostDto } from '../../../../src/posts/domain/dto/createPost/createPost.dto';
import { PostStatusEnum } from '../../../../src/posts/domain/enums/postStatus.enum';
import { PostTypeEnum } from '../../../../src/posts/domain/enums/postType.enum';
import { LanguageEnum } from '../../../../src/posts/domain/enums/language.enum';
import { CommentBuilder } from '../post/comment.builder';

export class CreatePostDtoBuilder {
  static get defaultAll(): InjectionBuilder<CreatePostDto> {
    return new InjectionBuilder<CreatePostDto>(new CreatePostDto()).with({
      status: PostStatusEnum.DRAFT,
      type: PostTypeEnum.ARTICLE,
      language: LanguageEnum.EN,
      title: 'title',
      body: 'body',
      tags: ['tag1'],
      comments: [CommentBuilder.defaultPreInserted.result]
    })
  }
}
