import {Pool as PostgresPool} from 'pg';
import makeDeliveriesDatabase from './deliveries-database';
import config from '../../../../core/config';

const databasePool = new PostgresPool({
  host: config.postgresUrl,
  port: config.postgresPort,
  user: config.postgresUser,
  password: config.postgresPassword,
  database: config.postgresDb,
});

const deliveriesDatabase = makeDeliveriesDatabase({
  databaseClient: databasePool,
  databaseTable: 'deliveries',
});

export default deliveriesDatabase;
