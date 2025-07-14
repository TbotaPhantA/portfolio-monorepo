import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsCreateService } from './services/postsCreate.service';
import { PostsRepository } from './posts.repository';

@Module({
  controllers: [PostsController],
  providers: [PostsCreateService, PostsRepository],
})
export class PostsModule {}
