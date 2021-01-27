import {QueryResult} from 'pg';
import {
  DatabaseClient,
  DatabaseController,
  OrderDbSchema,
  OrderWithoutPaymentCard,
} from '../../../../core/@types/global';

type queryResultType = QueryResult<OrderDbSchema>;

/**
 * Database interactions interface.
 *
 * @export
 * @param {({
 *   databaseClient: DatabaseClient,
 *   databaseTable: string
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
  databaseClient: DatabaseClient,
  databaseTable: string
}): DatabaseController {
  /**
   * Finds an entry in the database.
   *
   * @param {string} orderId
   */
  async function findById(orderId: string) {
    const result: queryResultType = await databaseClient.query(`
      SELECT * FROM ${databaseTable} WHERE id = $1
    `, [orderId],
    ).catch((e: Error) => console.log(e));

    return Object.freeze({
      id: result.rows[0].id,
      sender: {
        id: result.rows[0].sender_id,
        location: {
          latitude: result.rows[0].sender_location_latitude,
          longitude: result.rows[0].sender_location_longitude,
        },
      },
      receiver: {
        id: result.rows[0].receiver_id,
        location: {
          latitude: result.rows[0].receiver_location_latitude,
          longitude: result.rows[0].receiver_location_longitude,
        },
      },
      source: {
        ip: result.rows[0].source_ip,
        browser: result.rows[0].source_browser,
        referrer: result.rows[0].source_referrer,
      },
      createdOn: result.rows[0].created_on,
    });
  }

  /**
   * Inserts an entry in the database.
   *
   * @param {OrderDatabase} orderData
   */
  async function insert({
    id,
    sender,
    receiver,
    source,
    createdOn,
  }: OrderWithoutPaymentCard) {
    const result: queryResultType = await databaseClient.query(`
      INSERT INTO ${databaseTable}
      (
        id,
        sender_id,
        sender_location_latitude,
        sender_location_longitude,
        receiver_id,
        receiver_location_latitude,
        receiver_location_longitude,
        source_ip,
        source_browser,
        source_referrer,
        created_on
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, to_timestamp($11))
      RETURNING id
    `, [
      id,
      sender.id,
      sender.location.latitude,
      sender.location.longitude,
      receiver.id,
      receiver.location.latitude,
      receiver.location.longitude,
      source.ip,
      source.browser,
      source.referrer,
      createdOn,
    ],
    ).catch((e: Error) => console.log(e));

    return result.rows[0].id;
  }

  return Object.freeze({
    findById: findById,
    insert: insert,
  });
}
