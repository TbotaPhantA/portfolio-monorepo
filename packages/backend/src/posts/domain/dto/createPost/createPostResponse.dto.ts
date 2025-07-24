import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../../post/post';
import { PostResponseDto } from './postResponse.dto';

export class CreatePostResponseDto {
  @ApiProperty()
  post: PostResponseDto;

  static from(post: Post) {
    const dto = new CreatePostResponseDto();
    dto.post = PostResponseDto.from(post);
    return dto;
  }
}
