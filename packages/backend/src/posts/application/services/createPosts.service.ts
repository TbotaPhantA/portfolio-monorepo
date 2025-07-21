import { Injectable } from '@nestjs/common';
import { PostResponseDto } from '../../domain/dto/createPost/postResponse.dto';
import { CreatePostDto } from '../../domain/dto/createPost/createPost.dto';
import { Post } from '../../domain/post/post';
import { PostsRepository } from '../posts.repository';
import { MapDbConstraintErrors } from '../decorators/mapDBConstraintErrors';
import { ClsService } from 'nestjs-cls';
import { ClsStoreMap } from '../../../infrastructure/shared/types/clsStoreMap';

@Injectable()
export class CreatePostsService {
  constructor(
    private readonly repo: PostsRepository,
    private readonly cls: ClsService<ClsStoreMap>,
  ) {}

  @MapDbConstraintErrors()
  async create(dto: CreatePostDto): Promise<PostResponseDto> {
    const post = Post.createByDto(dto, this.cls.get('user'));
    await this.repo.insertAndFillInPost(post);
    return PostResponseDto.from(post);
  }
}
