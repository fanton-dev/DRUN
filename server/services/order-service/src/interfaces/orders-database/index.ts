import {Pool as PostgresPool} from 'pg';
import makeOrdersDatabase from './orders-database';
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
  databaseTable: 'orders',
});

export default ordersDatabase;
