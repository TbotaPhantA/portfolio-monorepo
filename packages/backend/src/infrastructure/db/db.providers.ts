import { DataSource } from 'typeorm';
import { config } from '../config/config';
import { RefreshToken } from '../../auth/domain/user/refreshToken/refreshToken';
import { Post } from '../../posts/domain/post/post';
import { Comment } from '../../posts/domain/post/comment/comment';
import { User } from '../../auth/domain/user/user';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: config.db.host,
        port: Number(config.db.port),
        username: config.db.username,
        password: config.db.password,
        database: config.db.name,
        entities: [User, RefreshToken, Post, Comment],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
