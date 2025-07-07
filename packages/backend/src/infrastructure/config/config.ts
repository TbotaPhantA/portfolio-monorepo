import * as process from 'process';

const isRequired = (propName: string): never => {
  throw new Error(`Config property ${propName} is required`);
};

class Config {
  server = {
    env: process.env.ENV ?? isRequired('ENV'),
    port: Number(process.env.PORT ?? isRequired('PORT')),
  };

  db = {
    username: process.env.POSTGRES_USER ?? isRequired('POSTGRES_USER'),
    password: process.env.POSTGRES_PASSWORD ?? isRequired('POSTGRES_PASSWORD'),
    host: process.env.POSTGRES_HOST ?? isRequired('POSTGRES_HOST'),
    port: Number(process.env.POSTGRES_PORT ?? isRequired('POSTGRES_PORT')),
    name: process.env.POSTGRES_DB ?? isRequired('POSTGRES_DB'),
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
  };
}

export const config = new Config();
