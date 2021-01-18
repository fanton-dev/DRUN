import {Client as PostgresClient, Pool as PostgresPool} from 'pg';
import {DatabaseController} from '../../../../core/@types/global';

/**
 * Database interactions interface.
 *
 * @export
 * @param {({
 *   databaseClient: (PostgresClient | PostgresPool),
 *   databaseTable: String
 * })} {
 *   databaseClient,
 *   databaseTable,
 * } - dependency injection
 * @return {DatabaseController} - database controller object
 */
export default function makeOrdersDatabase({
  databaseClient,
  databaseTable,
}: {
  databaseClient: (PostgresClient | PostgresPool),
  databaseTable: String
}): DatabaseController {
  // Table initialization
  databaseClient.connect();
  databaseClient.query(
      `CREATE TABLE IF NOT EXISTS ${databaseTable} (
        id UUID PRIMARY KEY,
        sender_id UUID NOT NULL, 
        sender_location_latitude FLOAT8 NOT NULL,
        sender_location_longitude FLOAT8 NOT NULL,
        receiver_id UUID NOT NULL,
        receiver_location_latitude FLOAT8 NOT NULL,
        receiver_location_longitude FLOAT8 NOT NULL,
        source_ip TEXT NOT NULL,
        source_browser TEXT NOT NULL,
        source_referrer TEXT NOT NULL,
        created_on TIMESTAMPTZ NOT NULL
      );`,
      (error, _) => {
        if (error) {
          throw error;
        }
      },
  );

  /**
   * Finds an entry in the database.
   *
   * @param {string} orderId
   */
  async function findById(orderId: String) {
    const result: any = await databaseClient.query(
        `SELECT * FROM ${databaseTable} WHERE id = '${orderId}'`)
        .catch((e) => console.log(e));
    return result.rows;
  }

  /**
   * Inserts an entry in the database.
   *
   * @param {OrderDatabase} orderData
   */
  async function insert(orderData: object) {
    await databaseClient.query(
        `INSERT INTO ${databaseTable} (${Object.keys(orderData)})
         VALUES (${Object.values(orderData)})`)
        .catch((e) => console.log(e));
  }

  return Object.freeze({
    findById: findById,
    insert: insert,
  });
}
