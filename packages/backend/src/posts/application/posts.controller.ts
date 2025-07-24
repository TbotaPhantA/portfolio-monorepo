import { Body, Controller, Post } from '@nestjs/common';
import { CreatePostsService } from './services/createPosts.service';
import { AuthGuards } from '../../auth/application/decorators/authentication';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ReadPostsService } from './services/readPosts.service';
import { UpdatePostsService } from './services/updatePosts.service';
import { Roles } from '../../auth/application/decorators/roles';
import {
  CreatePostDto,
  CreatePostResponseDto,
  SearchPostsParams,
  SearchPostsResponseDto,
  UpdatePostDto,
  UpdatePostResponseDto,
  UserRoleEnum,
} from '@portfolio/contracts';

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
  searchPosts(@Body() dto: SearchPostsParams): Promise<SearchPostsResponseDto> {
    return this.readService.searchPosts(dto);
  }

  @Post('/create-post')
  @Roles(UserRoleEnum.ADMIN)
  @ApiResponse({ type: CreatePostResponseDto })
  createPost(@Body() dto: CreatePostDto): Promise<CreatePostResponseDto> {
    return this.createService.create(dto);
  }

  @Post('/update-post')
  @Roles(UserRoleEnum.ADMIN)
  @ApiResponse({ type: UpdatePostResponseDto })
  updatePost(@Body() dto: UpdatePostDto): Promise<UpdatePostResponseDto> {
    return this.updateService.updateByDto(dto);
  }

  /**
   * TODO:
   * 2. PATCH /posts/add-comment
   * 3. PATCH /posts/delete-comment
   * 4. DELETE /posts/delete
   */
}
