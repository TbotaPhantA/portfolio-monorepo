import { Module } from '@nestjs/common';
import { AuthModule } from './auth/application/auth.module';
import { PostsModule } from './posts/application/posts.module';

@Module({
  imports: [AuthModule, PostsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
