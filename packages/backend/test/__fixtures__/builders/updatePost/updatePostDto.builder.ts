import { InjectionBuilder } from 'ts-fixture-builder';
import { UpdatePostDto } from '../../../../src/posts/domain/dto/updatePost/updatePost.dto';
import { PostStatusEnum } from '../../../../src/posts/domain/enums/postStatus.enum';
import { PostTypeEnum } from '../../../../src/posts/domain/enums/postType.enum';

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
