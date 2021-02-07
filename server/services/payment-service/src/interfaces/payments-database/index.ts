import {Pool as PostgresPool} from 'pg';
import makeOrdersDatabase from './payments-database';
import config from '../../../../core/config';

const databasePool = new PostgresPool({
  host: config.postgresUrl,
  port: config.postgresPort,
  user: config.postgresUser,
  password: config.postgresPassword,
  database: config.postgresDb,
});

const ordersDatabase = makeOrdersDatabase({
  databaseClient: databasePool,
  databaseTable: 'payments',
});

export default ordersDatabase;
