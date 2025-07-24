import { InjectionBuilder } from 'ts-fixture-builder';
import {
  PostStatusEnum,
  PostTypeEnum,
  UpdatePostDto,
} from '@portfolio/contracts';

export class UpdatePostDtoBuilder {
  static get defaultAll(): InjectionBuilder<UpdatePostDto> {
    return new InjectionBuilder<UpdatePostDto>(new UpdatePostDto()).with({
      postId: 1,
      status: PostStatusEnum.DRAFT,
      type: PostTypeEnum.ARTICLE,
      title: 'title',
      body: 'body',
      tags: ['tag1'],
    });
  }
}
