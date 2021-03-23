import config from 'config';

export = {
  cli: {
    migrationsDir: 'src/database/migrations',
  },
  type: 'postgres',
  synchronize: true,
  host: <string> config.get('POSTGRES_HOST_USERS_SERVICE'),
  username: <string> config.get('POSTGRES_USER'),
  password: <string> config.get('POSTGRES_PASSWORD'),
  database: <string> config.get('POSTGRES_DB'),
  entities: ['**/entities/*.ts'],
  migrations: ['**/migrations/*.ts'],
  migrationsRun: true,
};
