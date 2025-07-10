import * as process from 'process';

const isRequired = (propName: string): never => {
  throw new Error(`Config property ${propName} is required`);
};

export class Config {
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

  auth = {
    saltSize: +(process.env.SALT_SIZE ?? isRequired('SALT_SIZE')),
    keyLengthInBytes: +(
      process.env.KEY_LENGTH_IN_BYTES ?? isRequired('KEY_LENGTH_IN_BYTES')
    ),
    passwordPepper:
      process.env.PASSWORD_PEPPER ?? isRequired('PASSWORD_PEPPER'),
    encoding:
      (process.env.ENCODING as 'hex' | undefined) ?? isRequired('ENCODING'),
    accessToken: {
      privateKey:
        process.env.ACCESS_TOKEN_PRIVATE_KEY ??
        isRequired('ACCESS_TOKEN_PRIVATE_KEY'),
      expiryInSeconds: Number(
        process.env.ACCESS_TOKEN_EXPIRY_IN_SECONDS ??
          isRequired('ACCESS_TOKEN_EXPIRY_IN_SECONDS'),
      ),
    },
    refreshToken: {
      privateKey:
        process.env.REFRESH_TOKEN_PRIVATE_KEY ??
        isRequired('REFRESH_TOKEN_PRIVATE_KEY'),
      expiryInSeconds: Number(
        process.env.REFRESH_TOKEN_EXPIRY_IN_SECONDS ??
          isRequired('REFRESH_TOKEN_EXPIRY_IN_SECONDS'),
      ),
    },
  };
}

export const config = new Config();
