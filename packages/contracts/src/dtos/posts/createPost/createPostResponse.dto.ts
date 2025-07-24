import { ApiProperty } from '@nestjs/swagger';
import { PostResponseDto } from './postResponse.dto';

export class CreatePostResponseDto {
  @ApiProperty()
  post!: PostResponseDto;

  static from(rawPost: PostResponseDto): CreatePostResponseDto {
    const dto = new CreatePostResponseDto();
    dto.post = PostResponseDto.from(rawPost);
    return dto;
  }
}
