import { Module } from '@nestjs/common';
import { AuthModule } from './auth/application/auth.module';
import { PostsModule } from './posts/application/posts.module';
import { DBModule } from './infrastructure/db/db.module';

@Module({
  imports: [DBModule, AuthModule, PostsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
