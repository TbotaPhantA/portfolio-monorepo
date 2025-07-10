import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsCreateService } from './services/postsCreate.service';

@Module({
  controllers: [PostsController],
  providers: [PostsCreateService],
})
export class PostsModule {}
