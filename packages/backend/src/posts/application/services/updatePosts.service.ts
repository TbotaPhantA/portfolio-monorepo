import { Injectable } from '@nestjs/common';
import { UpdatePostResponseDto } from '../../domain/dto/updatePost/updatePostResponse.dto';
import { PostsRepository } from '../posts.repository';
import { UpdatePostDto } from '../../domain/dto/updatePost/updatePost.dto';
import { UserPayload } from '../../../infrastructure/shared/types/userPayload';
import { MapDbConstraintErrors } from '../decorators/mapDBConstraintErrors';
import { ReadPostsService } from './readPosts.service';
import { Propagation, Transactional } from '@nestjs-cls/transactional';
import { KyselyCLS } from '../../../infrastructure/shared/types/kyselyCLS';

@Injectable()
export class UpdatePostsService {
  constructor(
    private readonly repo: PostsRepository,
    private readonly readService: ReadPostsService,
  ) {}

  @Transactional<KyselyCLS>(Propagation.Required, {
    isolationLevel: 'read committed',
  })
  @MapDbConstraintErrors()
  async updateByDto(
    dto: UpdatePostDto,
    user: UserPayload,
  ): Promise<UpdatePostResponseDto> {
    const post = await this.readService.getPostById(dto.postId);
    post.updateByDto(dto, user);
    await this.repo.update(post);
    return UpdatePostResponseDto.from(post);
  }
}
