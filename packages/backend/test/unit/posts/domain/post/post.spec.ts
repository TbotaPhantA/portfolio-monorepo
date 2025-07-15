import { Post } from '../../../../../src/posts/domain/post/post';
import { CreatePostDtoBuilder } from '../../../../__fixtures__/builders/createPost/createPostDto.builder';
import { PostBuilder } from '../../../../__fixtures__/builders/post/post.builder';
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
});
