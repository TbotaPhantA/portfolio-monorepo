import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../posts.repository';
import { MapDbConstraintErrors } from '../decorators/mapDBConstraintErrors';
import { ReadPostsService } from './readPosts.service';
import { Propagation, Transactional } from '@nestjs-cls/transactional';
import { KyselyCLS } from '../../../infrastructure/shared/types/kyselyCLS';
import { ClsService } from 'nestjs-cls';
import { ClsStoreMap } from '../../../infrastructure/shared/types/clsStoreMap';
import { UpdatePostDto, UpdatePostResponseDto } from '@portfolio/contracts';
import { Span } from 'nestjs-otel';

@Injectable()
export class UpdatePostsService {
  constructor(
    private readonly repo: PostsRepository,
    private readonly readService: ReadPostsService,
    private readonly cls: ClsService<ClsStoreMap>,
  ) {}

  @Span()
  @Transactional<KyselyCLS>(Propagation.Required, {
    isolationLevel: 'read committed',
  })
  @MapDbConstraintErrors()
  async updateByDto(dto: UpdatePostDto): Promise<UpdatePostResponseDto> {
    const post = await this.readService.getPostById(dto.postId);
    post.updateByDto(dto, this.cls.get('user'));
    await this.repo.update(post);
    return UpdatePostResponseDto.from(post);
  }
}
