import {
  DatabaseClient,
  DatabaseQueryResults,
  OrderLogsDatabaseController,
  OrderDatabaseSchema,
  QueueMessage,
  OrderLogsDatabaseSchema,
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
 * @return {OrderLogsDatabaseController} - database controller object
 */
export default function makeOrdersDatabase({
  databaseClient,
  databaseTable,
}: {
  databaseClient: DatabaseClient,
  databaseTable: string
}): OrderLogsDatabaseController {
  /**
   * Finds an entry in the database.
   *
   * @param {string} orderId
   * @return {
   *    Promise<OrderWithoutPaymentCard | { error: string; }>
   * } - order entry from database
   */
  async function findLogsOfOrder(
      orderId: string,
  ): Promise<Array<any> | { error: string; }> {
    const resultRows: void | DatabaseQueryResults<OrderLogsDatabaseSchema> =
    await databaseClient.query(`
      SELECT * FROM ${databaseTable} WHERE order_id = $1
    `, [orderId],
    ).catch((e: Error) => console.log(e));

    if (!resultRows) {
      return {error: 'No such order found.'};
    }

    const results = resultRows.rows;
    return results.map((result) => Object.freeze({
      subject: result.subject,
      body: JSON.parse(result.body),
    }));
  }

  /**
   * Inserts an entry in the database.
   *
   * @param {QueueMessage<any>} {
   *     subject,
   *     body,
   *   } - message to be logged
   * @return {string} - log id
   */
  async function insert({
    subject,
    body,
  }: QueueMessage<any>): Promise<{ id: string } | { error: string; }> {
    const resultRows: void | DatabaseQueryResults<OrderDatabaseSchema> = await
    databaseClient.query(`
      INSERT INTO ${databaseTable}
      (
        order_id,
        subject,
        body
      )
      VALUES ($1, $2, $3)
      RETURNING id
    `, [
      body.orderId || body.id,
      subject,
      JSON.stringify(body),
    ],
    ).catch((e: Error) => console.log(e));

    if (!resultRows) {
      return {error: 'Error while storing logs.'};
    }

    const result = resultRows.rows[0];
    return {id: result.id};
  }

  return Object.freeze({
    findLogsOfOrder: findLogsOfOrder,
    insert: insert,
  });
}
