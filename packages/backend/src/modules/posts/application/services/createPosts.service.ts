import { Injectable } from '@nestjs/common';
import { Post } from '../../domain/post/post';
import { PostsRepository } from '../posts.repository';
import { MapDbConstraintErrors } from '../decorators/mapDBConstraintErrors';
import { ClsService } from 'nestjs-cls';
import { CreatePostDto, CreatePostResponseDto } from '@portfolio/contracts';
import { Span } from 'nestjs-otel';
import { ClsStoreMap } from '../../../../infrastructure/shared/types/clsStoreMap';

@Injectable()
export class CreatePostsService {
  constructor(
    private readonly repo: PostsRepository,
    private readonly cls: ClsService<ClsStoreMap>,
  ) {}

  @Span()
  @MapDbConstraintErrors()
  async create(dto: CreatePostDto): Promise<CreatePostResponseDto> {
    const post = Post.createByDto(dto, this.cls.get('user'));
    await this.repo.insertAndFillInPost(post);
    return CreatePostResponseDto.from(post);
  }
}
