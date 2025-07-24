import { ApiProperty } from '@nestjs/swagger';
import { PostResponseDto } from '../createPost/postResponse.dto';

export class SearchPostsResponseDto {
  @ApiProperty({ type: PostResponseDto })
  posts!: PostResponseDto[];

  static fromMany(rawPosts: PostResponseDto[]): SearchPostsResponseDto {
    const dto = new SearchPostsResponseDto();
    dto.posts = PostResponseDto.fromMany(rawPosts);
    return dto;
  }
}
