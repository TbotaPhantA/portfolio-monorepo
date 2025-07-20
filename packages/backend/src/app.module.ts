import { Module } from '@nestjs/common';
import { AuthModule } from './auth/application/auth.module';
import { PostsModule } from './posts/application/posts.module';
import { DBModule } from './infrastructure/db/db.module';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterKysely } from '@nestjs-cls/transactional-adapter-kysely';
import { KYSELY_MODULE_CONNECTION_TOKEN } from 'nestjs-kysely';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    DBModule,
    AuthModule,
    PostsModule,
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [DBModule],
          adapter: new TransactionalAdapterKysely({
            kyselyInstanceToken: KYSELY_MODULE_CONNECTION_TOKEN(),
          }),
        }),
      ],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
