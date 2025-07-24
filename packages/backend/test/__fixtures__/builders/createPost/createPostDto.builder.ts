import { InjectionBuilder } from 'ts-fixture-builder';
import {
  CreatePostDto,
  LanguageEnum,
  PostStatusEnum,
  PostTypeEnum,
} from '@portfolio/contracts';

export class CreatePostDtoBuilder {
  static get defaultAll(): InjectionBuilder<CreatePostDto> {
    return new InjectionBuilder<CreatePostDto>(new CreatePostDto()).with({
      status: PostStatusEnum.DRAFT,
      type: PostTypeEnum.ARTICLE,
      language: LanguageEnum.EN,
      title: 'title',
      body: 'body',
      tags: ['tag1'],
    });
  }
}
