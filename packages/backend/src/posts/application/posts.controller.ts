import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreatePostDto } from '../domain/dto/createPost/createPost.dto';
import { PostResponseDto } from '../domain/dto/createPost/postResponse.dto';
import { CreatePostsService } from './services/createPosts.service';
import { Authentication } from '../../auth/application/decorators/authentication';
import { UserPayload } from '../../infrastructure/shared/types/userPayload';
import { UserRoleEnum } from '../../auth/domain/enums/userRole.enum';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { SearchPostsParams } from '../domain/dto/search/searchPostsParamDto';
import { ReadPostsService } from './services/readPosts.service';
import { SearchPostsResponseDto } from '../domain/dto/search/searchPostsResponseDto';
import { UpdatePostResponseDto } from '../domain/dto/updatePost/updatePostResponse.dto';
import { UpdatePostDto } from '../domain/dto/updatePost/updatePost.dto';
import { UpdatePostsService } from './services/updatePosts.service';

@ApiBearerAuth()
@Authentication([UserRoleEnum.ADMIN])
@Controller('posts')
export class PostsController {
  constructor(
    private readonly readService: ReadPostsService,
    private readonly createService: CreatePostsService,
    private readonly updateService: UpdatePostsService,
  ) {}

  @Post('/search-posts')
  @ApiResponse({ type: SearchPostsResponseDto })
  async searchPosts(
    @Body() dto: SearchPostsParams,
  ): Promise<SearchPostsResponseDto> {
    return this.readService.searchPosts(dto);
  }

  @Post('/create-post')
  @ApiResponse({ type: PostResponseDto })
  async createPost(
    @Body() dto: CreatePostDto,
    @Req() { user }: { user: UserPayload }, // TODO: validate user payload
  ): Promise<PostResponseDto> {
    return await this.createService.create(dto, user);
  }

  @Post('/update-post')
  @ApiResponse({ type: UpdatePostResponseDto })
  async updatePost(
    @Body() dto: UpdatePostDto,
    @Req() { user }: { user: UserPayload }, // TODO: validate user payload
  ): Promise<UpdatePostResponseDto> {
    return this.updateService.updateByDto(dto, user);
  }

  /**
   * TODO:
   * 2. PATCH /posts/add-comment
   * 3. PATCH /posts/delete-comment
   * 4. DELETE /posts/delete
   */
}
