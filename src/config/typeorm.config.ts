import { registerAs } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export function buildDataSourceOptions(
  baseDir: string,
  options: { forMigrations?: boolean } = {},
): DataSourceOptions {
  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [baseDir + '/**/*.entity{.ts,.js}'],
    migrations: [baseDir + '/database/migrations/*{.ts,.js}'],
    synchronize: false,
    ...(options.forMigrations
      ? {}
      : {
          extra: {
            max: 10,
            statement_timeout: 10_000,
          },
        }),
  };
}

export const typeormConfig = registerAs('typeorm', () =>
  buildDataSourceOptions(__dirname + '/..'),
);
