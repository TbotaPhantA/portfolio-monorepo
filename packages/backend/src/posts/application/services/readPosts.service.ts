import { BadRequestException, Injectable } from '@nestjs/common';
import { PostsRepository } from '../posts.repository';
import { Post } from '../../domain/post/post';
import { POST_NOT_FOUND } from '../../../infrastructure/shared/constants';
import {
  SearchPostsParams,
  SearchPostsResponseDto,
} from '@portfolio/contracts';

@Injectable()
export class ReadPostsService {
  constructor(private readonly repo: PostsRepository) {}

  searchPosts(dto: SearchPostsParams): Promise<SearchPostsResponseDto> {
    return this.repo.searchPosts(dto);
  }

  async getPostById(postId: number): Promise<Post> {
    const post = await this.repo.findOneById(postId);

    if (!post) {
      throw new BadRequestException(POST_NOT_FOUND);
    }

    return post;
  }
}
