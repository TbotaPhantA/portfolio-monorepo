import { ApiProperty } from '@nestjs/swagger';
import { PostResponseDto } from '../createPost/postResponse.dto';

export class SearchPostsResponseDto {
  @ApiProperty({ type: PostResponseDto })
  posts: PostResponseDto[];

  static from(
    posts: Omit<PostResponseDto, 'comments'>[],
  ): SearchPostsResponseDto {
    const dto = new SearchPostsResponseDto();

    dto.posts = posts.map((post) =>
      PostResponseDto.from({ ...post, comments: [] }),
    );

    return dto;
  }
}
