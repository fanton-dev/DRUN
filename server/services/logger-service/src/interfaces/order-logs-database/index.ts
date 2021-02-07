import {Pool as PostgresPool} from 'pg';
import makeOrderLogsDatabase from './order-logs-database';
import config from '../../../../core/config';

const databasePool = new PostgresPool({
  host: config.postgresUrl,
  port: config.postgresPort,
  user: config.postgresUser,
  password: config.postgresPassword,
  database: config.postgresDb,
});

const orderLogsDatabase = makeOrderLogsDatabase({
  databaseClient: databasePool,
  databaseTable: 'order_logs',
});

export default orderLogsDatabase;
