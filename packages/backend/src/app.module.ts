import { Module } from '@nestjs/common';
import { DBModule } from './infrastructure/db/db.module';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterKysely } from '@nestjs-cls/transactional-adapter-kysely';
import { KYSELY_MODULE_CONNECTION_TOKEN } from 'nestjs-kysely';
import { ClsModule } from 'nestjs-cls';
import { OpenTelemetryModule } from 'nestjs-otel';
import { OtelConfigService } from './infrastructure/otel/opentelemetry.factory';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { AuthModule } from './modules/auth/application/auth.module';
import { PostsModule } from './modules/posts/application/posts.module';

const OpenTelemetryModuleConfig = OpenTelemetryModule.forRootAsync({
  useClass: OtelConfigService,
});

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    OpenTelemetryModuleConfig,
    LoggerModule,
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
      plugins: [
        new ClsPluginTransactional({
          imports: [DBModule],
          adapter: new TransactionalAdapterKysely({
            kyselyInstanceToken: KYSELY_MODULE_CONNECTION_TOKEN(),
          }),
        }),
      ],
    }),
    DBModule,
    AuthModule,
    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
