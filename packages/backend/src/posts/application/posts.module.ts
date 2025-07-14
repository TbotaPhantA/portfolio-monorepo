import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { CreatePostsService } from './services/createPosts.service';
import { PostsRepository } from './posts.repository';
import { ReadPostsService } from './services/readPosts.service';

@Module({
  controllers: [PostsController],
  providers: [ReadPostsService, CreatePostsService, PostsRepository],
})
export class PostsModule {}
