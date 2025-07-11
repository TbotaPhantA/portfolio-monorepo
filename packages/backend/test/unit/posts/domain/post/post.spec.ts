import { Post } from '../../../../../src/posts/domain/post/post';
import { CreatePostDtoBuilder } from '../../../../__fixtures__/builders/createPost/createPostDto.builder';
import { PostBuilder } from '../../../../__fixtures__/builders/post/post.builder';
import { User } from '../../../../../src/auth/domain/user/user';

describe(`${Post.name}`, () => {
  describe(`${Post.createByDto.name}`, () => {
    const testCases = [
      {
        toString: () => '1 default creation - should be properly created',
        dto: CreatePostDtoBuilder.defaultAll.result,
        user: { userId: 1 } satisfies Pick<User, 'userId'>,
        expectedPost: PostBuilder.defaultPreInserted.result,
      },
    ];

    test.each(testCases)('%s', ({ dto, user, expectedPost }) => {
      const resultPost = Post.createByDto(dto, user);
      expect(resultPost).toStrictEqual(expectedPost);
    });
  });
});
