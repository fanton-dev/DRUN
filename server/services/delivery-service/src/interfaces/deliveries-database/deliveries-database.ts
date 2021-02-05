import {
  DatabaseClient,
  DatabaseQueryResults,
  Delivery,
  DeliveryDatabaseController,
  DeliveryDatabaseSchema,
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
 * @return {DeliveryDatabaseController} - database controller object
 */
export default function makeDeliveriesDatabase({
  databaseClient,
  databaseTable,
}: {
  databaseClient: DatabaseClient,
  databaseTable: string
}): DeliveryDatabaseController {
  /**
   * Finds an entry in the database.
   *
   * @param {string} deliveryId
   * @return {
   *    Promise<DeliveryWithoutPaymentCard | { error: string; }>
   * } - delivery entry from database
   */
  async function findById(
      deliveryId: string,
  ): Promise<Delivery | { error: string; }> {
    const resultRows: void |
    DatabaseQueryResults<DeliveryDatabaseSchema> = await databaseClient.query(`
      SELECT * FROM ${databaseTable} WHERE id = $1
    `, [deliveryId],
    ).catch((e: Error) => console.log(e));

    if (!resultRows) {
      return {error: 'No such delivery found.'};
    }

    const result = resultRows.rows[0];
    return Object.freeze({
      id: result.id,
      orderId: result.order_id,
      senderLocation: {
        latitude: result.sender_location_latitude,
        longitude: result.sender_location_longitude,
      },
      receiverLocation: {
        latitude: result.receiver_location_latitude,
        longitude: result.receiver_location_longitude,
      },
      createdOn: result.created_on,
      completedOn: result.completed_on,
    });
  }

  /**
   * Inserts an entry in the database.
   *
   * @param {DeliveryWithoutPaymentCard} {
   *     id,
   *     sender,
   *     receiver,
   *     source,
   *     createdOn,
   *   } - delivery details
   * @return {string} - delivery id
   */
  async function insert({
    id,
    orderId,
    drone,
    senderLocation,
    receiverLocation,
    createdOn,
    completedOn,
  }: Delivery): Promise<{ id: string } | { error: string; }> {
    const resultRows: void |
    DatabaseQueryResults<DeliveryDatabaseSchema> = await databaseClient.query(`
      INSERT INTO ${databaseTable}
      (
        id,
        order_id,
        drone_id,
        drone_home_location_latitude,
        drone_home_location_longitude,
        drone_source_ip,
        drone_source_browser,
        drone_source_referrer,
        sender_location_latitude,
        sender_location_longitude,
        receiver_location_latitude,
        receiver_location_longitude,
        created_on,
        completed_on
      )
      VALUES
      (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
        to_timestamp($12), to_timestamp($13)
      )
      RETURNING id
    `, [
      id,
      orderId,
      drone?.getHomeLocation().getLatitude(),
      drone?.getHomeLocation().getLongitude(),
      drone?.getSource().getIp(),
      drone?.getSource().getBrowser(),
      drone?.getSource().getReferrer(),
      senderLocation.latitude,
      senderLocation.longitude,
      receiverLocation.latitude,
      receiverLocation.longitude,
      createdOn,
      completedOn,
    ],
    ).catch((e: Error) => console.log(e));

    if (!resultRows) {
      return {error: 'Delivery cannot be created.'};
    }

    const result = resultRows.rows[0];
    return {id: result.id};
  }

  return Object.freeze({
    findById: findById,
    insert: insert,
  });
}
