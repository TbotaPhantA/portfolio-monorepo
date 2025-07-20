import { Module } from '@nestjs/common';
import {
  CamelCasePlugin,
  ParseJSONResultsPlugin,
  PostgresDialect,
} from 'kysely';
import { KyselyModule } from 'nestjs-kysely';
import { Pool } from 'pg';
import { config } from '../config/config';

const kyselyModule = KyselyModule.forRoot({
  dialect: new PostgresDialect({
    pool: new Pool({
      database: config.db.name,
      user: config.db.username,
      password: config.db.password,
      host: config.db.host,
      port: config.db.port,
      max: 10,
    }),
  }),
  plugins: [new ParseJSONResultsPlugin(), new CamelCasePlugin()],
});

@Module({
  imports: [kyselyModule],
  exports: [kyselyModule],
})
export class DBModule {}
