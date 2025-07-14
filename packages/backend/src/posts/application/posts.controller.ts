import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreatePostDto } from '../domain/dto/createPost/createPost.dto';
import { PostResponseDto } from '../domain/dto/createPost/postResponse.dto';
import { PostsCreateService } from './services/postsCreate.service';
import { Authentication } from '../../auth/application/decorators/authentication';
import { UserPayload } from '../../infrastructure/shared/types/userPayload';
import { UserRoleEnum } from '../../auth/domain/enums/userRole.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Authentication([UserRoleEnum.ADMIN])
@Controller('posts')
export class PostsController {
  constructor(private readonly createService: PostsCreateService) {}

  @Post()
  async createPost(
    @Body() dto: CreatePostDto,
    @Req() { user }: { user: UserPayload }, // TODO: validate user payload
  ): Promise<PostResponseDto> {
    return this.createService.create(dto, user);
  }
}
