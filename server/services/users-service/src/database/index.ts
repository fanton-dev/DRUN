import knexfile from '@src/database/knexfile';
import knex from 'knex';

// TODO: Production config
const database = knex(knexfile.development);

export default database;
export {database};
