import { ApiProperty } from '@nestjs/swagger';
import { PostResponseDto } from '../createPost/postResponse.dto';

export class UpdatePostResponseDto {
  @ApiProperty()
  post!: PostResponseDto;

  static from(rawPost: PostResponseDto) {
    const dto = new UpdatePostResponseDto();
    dto.post = PostResponseDto.from(rawPost);
    return dto;
  }
}
