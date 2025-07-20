import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdatePostResponseDto } from '../../domain/dto/updatePost/updatePostResponse.dto';
import { PostsRepository } from '../posts.repository';
import { POST_NOT_FOUND } from '../../../infrastructure/shared/constants';
import { UpdatePostDto } from '../../domain/dto/updatePost/updatePost.dto';
import { UserPayload } from '../../../infrastructure/shared/types/userPayload';
import { Post } from '../../domain/post/post';

@Injectable()
export class UpdatePostsService {
  constructor(private readonly repo: PostsRepository) {}

  async updateByDto(
    dto: UpdatePostDto,
    user: UserPayload,
  ): Promise<UpdatePostResponseDto> {
    const post = await this.getPostById(dto.postId);
    post.updateByDto(dto, user);
    await this.repo.update(post);
    return UpdatePostResponseDto.from(post);
  }

  private async getPostById(postId: number): Promise<Post> {
    const post = await this.repo.findOneById(postId);

    if (!post) {
      throw new BadRequestException(POST_NOT_FOUND);
    }

    return post;
  }
}
