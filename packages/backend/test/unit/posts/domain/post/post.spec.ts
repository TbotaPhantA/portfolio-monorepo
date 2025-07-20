import { ForbiddenException } from '@nestjs/common';
import { PostStatusEnum } from '../../../../../src/posts/domain/enums/postStatus.enum';
import { PostTypeEnum } from '../../../../../src/posts/domain/enums/postType.enum';
import { Post } from '../../../../../src/posts/domain/post/post';
import { CreatePostDtoBuilder } from '../../../../__fixtures__/builders/createPost/createPostDto.builder';
import { PostBuilder } from '../../../../__fixtures__/builders/post/post.builder';
import { UpdatePostDtoBuilder } from '../../../../__fixtures__/builders/updatePost/updatePostDto.builder';
import { UserPayloadBuilder } from '../../../../__fixtures__/builders/user/userPayload.builder';

describe(`${Post.name}`, () => {
  describe(`${Post.createByDto.name}`, () => {
    const testCases = [
      {
        toString: () => '1 default creation - should be properly created',
        dto: CreatePostDtoBuilder.defaultAll.result,
        user: UserPayloadBuilder.defaultAll.result,
        expectedPost: PostBuilder.defaultPreInserted.result,
      },
      {
        toString: () => '2 default creation - should be properly created',
        dto: CreatePostDtoBuilder.defaultAll.with({
          tags: ['sdfsdf', 'sdfsdf'],
        }).result,
        user: UserPayloadBuilder.defaultAll.result,
        expectedPost: PostBuilder.defaultPreInserted.with({
          tags: ['sdfsdf', 'sdfsdf'],
        }).result,
      },
    ];

    test.each(testCases)('%s', ({ dto, user, expectedPost }) => {
      const resultPost = Post.createByDto(dto, user);
      expect(resultPost).toStrictEqual(expectedPost);
    });
  });

  describe(`${Post.prototype.updateByDto.name}`, () => {
    const testCases = [
      {
        toString: () => '1 default update - should be properly updated',
        dto: UpdatePostDtoBuilder.defaultAll.result,
        post: PostBuilder.defaultAll.result,
        expectedPost: PostBuilder.defaultAll.result,
        expectedChanges: {},
      },
      {
        toString: () => '2 custom fields update - should be properly updated',
        dto: UpdatePostDtoBuilder.defaultAll.with({
          status: PostStatusEnum.PUBLIC,
          type: PostTypeEnum.BOOK_REVIEW,
          title: 'title2',
          body: 'body2',
          tags: ['tag2'],
        }).result,
        post: PostBuilder.defaultAll.with({
          status: PostStatusEnum.DRAFT,
          type: PostTypeEnum.ARTICLE,
          title: 'title1',
          body: 'body1',
          tags: ['tag1'],
        }).result,
        expectedPost: PostBuilder.defaultAll.with({
          status: PostStatusEnum.PUBLIC,
          type: PostTypeEnum.BOOK_REVIEW,
          title: 'title2',
          body: 'body2',
          tags: ['tag2'],
        }).result,
        expectedChanges: {
          status: PostStatusEnum.PUBLIC,
          type: PostTypeEnum.BOOK_REVIEW,
          title: 'title2',
          body: 'body2',
          tags: ['tag2'],
        },
      },
    ];

    test.each(testCases)(
      '%s',
      ({ dto, post, expectedPost, expectedChanges }) => {
        const postFromDB = Post.createFromDB(post);
        postFromDB.updateByDto(dto, UserPayloadBuilder.defaultAll.result);
        expect(postFromDB).toStrictEqual(expectedPost);
        expect(postFromDB.changes()).toStrictEqual(expectedChanges);
      },
    );

    const throwsTestCases = [
      {
        toString: () => '1 when user doesnt match - should throw',
        dto: UpdatePostDtoBuilder.defaultAll.result,
        user: UserPayloadBuilder.defaultAll.with({
          userId: 1,
        }).result,
        post: PostBuilder.defaultAll.with({
          userId: 2,
        }).result,
        expectedError: new ForbiddenException(),
      },
    ];

    test.each(throwsTestCases)('%s', ({ dto, user, post, expectedError }) => {
      const postFromDB = Post.createFromDB(post);
      expect(() => postFromDB.updateByDto(dto, user)).toThrow(expectedError);
    });
  });
});
