import dotenv from 'dotenv';

dotenv.config({path: '@root/.env'});

export default {
  development: {
    client: 'postgresql',
    connection: {
      host: <string> process.env.POSTGRES_HOST,
      user: <string> process.env.POSTGRES_USER,
      password: <string> process.env.POSTGRES_PASSWORD,
      database: <string> process.env.POSTGRES_DB_LOGS_SERVICE,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      host: <string> process.env.POSTGRES_HOST,
      user: <string> process.env.POSTGRES_USER,
      password: <string> process.env.POSTGRES_PASSWORD,
      database: <string> process.env.POSTGRES_DB_LOGS_SERVICE,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
