import {
  DatabaseClient,
  DatabaseQueryResults,
  OrderDatabaseController,
  OrderDatabaseSchema,
  OrderWithoutPaymentCard,
} from '../../../../core/@types/global';

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
 * @return {OrderDatabaseController} - database controller object
 */
export default function makeOrdersDatabase({
  databaseClient,
  databaseTable,
}: {
  databaseClient: DatabaseClient,
  databaseTable: string
}): OrderDatabaseController {
  /**
   * Finds an entry in the database.
   *
   * @param {string} orderId
   * @return {
   *    Promise<OrderWithoutPaymentCard | { error: string; }>
   * } - order entry from database
   */
  async function findById(
      orderId: string,
  ): Promise<OrderWithoutPaymentCard | { error: string; }> {
    const resultRows: void | DatabaseQueryResults<OrderDatabaseSchema> = await
    databaseClient.query(`
      SELECT * FROM ${databaseTable} WHERE id = $1
    `, [orderId],
    ).catch((e: Error) => console.log(e));

    if (!resultRows) {
      return {error: 'No such order found.'};
    }

    const result = resultRows.rows[0];
    return Object.freeze({
      id: result.id,
      sender: {
        id: result.sender_id,
        location: {
          latitude: result.sender_location_latitude,
          longitude: result.sender_location_longitude,
        },
      },
      receiver: {
        id: result.receiver_id,
        location: {
          latitude: result.receiver_location_latitude,
          longitude: result.receiver_location_longitude,
        },
      },
      source: {
        ip: result.source_ip,
        browser: result.source_browser,
        referrer: result.source_referrer,
      },
      createdOn: result.created_on,
    });
  }

  /**
   * Inserts an entry in the database.
   *
   * @param {OrderWithoutPaymentCard} {
   *     id,
   *     sender,
   *     receiver,
   *     source,
   *     createdOn,
   *   } - order details
   * @return {string} - order id
   */
  async function insert({
    id,
    sender,
    receiver,
    source,
    createdOn,
  }: OrderWithoutPaymentCard): Promise<{ id: string } | { error: string; }> {
    const resultRows: void | DatabaseQueryResults<OrderDatabaseSchema> = await
    databaseClient.query(`
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

    if (!resultRows) {
      return {error: 'No such order found.'};
    }

    const result = resultRows.rows[0];
    return {id: result.id};
  }

  return Object.freeze({
    findById: findById,
    insert: insert,
  });
}
