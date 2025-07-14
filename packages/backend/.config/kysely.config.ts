import * as kyselyCtl from 'kysely-ctl'
import { CamelCasePlugin, ParseJSONResultsPlugin, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

export default kyselyCtl.defineConfig({
  // replace me with a real dialect instance OR a dialect name + `dialectConfig` prop.
  dialect: new PostgresDialect({
    pool: new Pool({
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      max: 10,
    })
  }),
  migrations: {
    migrationFolder: "migrations",
  },
  seeds: {
    seedFolder: "seeds",
  },
  plugins: [new ParseJSONResultsPlugin(), new CamelCasePlugin()]
})
