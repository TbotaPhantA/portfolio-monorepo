import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../posts.repository';
import { SearchPostsParams } from '../../domain/dto/search/searchPostsParamDto';
import { SearchPostsResponseDto } from '../../domain/dto/search/searchPostsResponseDto';

@Injectable()
export class ReadPostsService {
  constructor(private readonly repo: PostsRepository) {}

  searchPosts(dto: SearchPostsParams): Promise<SearchPostsResponseDto> {
    return this.repo.searchPosts(dto);
  }
}
