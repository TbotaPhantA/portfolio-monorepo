import { Injectable } from '@nestjs/common';
import { PostResponseDto } from '../../domain/dto/createPost/postResponse.dto';
import { CreatePostDto } from '../../domain/dto/createPost/createPost.dto';
import { Post } from '../../domain/post/post';
import { UserPayload } from '../../../infrastructure/shared/types/userPayload';
import { PostsRepository } from '../posts.repository';

@Injectable()
export class PostsCreateService {
  constructor(private readonly repo: PostsRepository) {}

  async create(dto: CreatePostDto, user: UserPayload): Promise<PostResponseDto> {
    const post = Post.createByDto(dto, user);
    await this.repo.insertAndFillInPost(post);
    return PostResponseDto.from(post);
  }
}
