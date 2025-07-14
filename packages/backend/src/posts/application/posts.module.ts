import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { CreatePostsService } from './services/createPosts.service';
import { PostsRepository } from './posts.repository';

@Module({
  controllers: [PostsController],
  providers: [CreatePostsService, PostsRepository],
})
export class PostsModule {}
