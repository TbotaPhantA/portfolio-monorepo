import { Body, Controller, Post } from '@nestjs/common';
import { CreatePostDto } from '../domain/dto/createPost/createPost.dto';
import { CreatePostsService } from './services/createPosts.service';
import { AuthGuards } from '../../auth/application/decorators/authentication';
import { UserRoleEnum } from '../../auth/domain/enums/userRole.enum';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { SearchPostsParams } from '../domain/dto/search/searchPostsParamDto';
import { ReadPostsService } from './services/readPosts.service';
import { SearchPostsResponseDto } from '../domain/dto/search/searchPostsResponseDto';
import { UpdatePostResponseDto } from '../domain/dto/updatePost/updatePostResponse.dto';
import { UpdatePostDto } from '../domain/dto/updatePost/updatePost.dto';
import { UpdatePostsService } from './services/updatePosts.service';
import { Roles } from '../../auth/application/decorators/roles';
import { CreatePostResponseDto } from '../domain/dto/createPost/createPostResponse.dto';

@ApiBearerAuth()
@AuthGuards()
@Controller('posts')
export class PostsController {
  constructor(
    private readonly readService: ReadPostsService,
    private readonly createService: CreatePostsService,
    private readonly updateService: UpdatePostsService,
  ) {}

  @Post('/search-posts')
  @ApiResponse({ type: SearchPostsResponseDto })
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.VISITOR)
  async searchPosts(
    @Body() dto: SearchPostsParams,
  ): Promise<SearchPostsResponseDto> {
    return this.readService.searchPosts(dto);
  }

  @Post('/create-post')
  @Roles(UserRoleEnum.ADMIN)
  @ApiResponse({ type: CreatePostResponseDto })
  async createPost(@Body() dto: CreatePostDto): Promise<CreatePostResponseDto> {
    return await this.createService.create(dto);
  }

  @Post('/update-post')
  @Roles(UserRoleEnum.ADMIN)
  @ApiResponse({ type: UpdatePostResponseDto })
  async updatePost(@Body() dto: UpdatePostDto): Promise<UpdatePostResponseDto> {
    return this.updateService.updateByDto(dto);
  }

  /**
   * TODO:
   * 2. PATCH /posts/add-comment
   * 3. PATCH /posts/delete-comment
   * 4. DELETE /posts/delete
   */
}
