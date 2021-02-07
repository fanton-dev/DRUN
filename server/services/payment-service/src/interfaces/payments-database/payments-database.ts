import {
  DatabaseClient,
  DatabaseQueryResults,
  PaymentDatabaseController,
  PaymentDatabaseSchema,
  PaymentWithoutPaymentCard,
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
 * @return {PaymentDatabaseController} - database controller object
 */
export default function makePaymentsDatabase({
  databaseClient,
  databaseTable,
}: {
  databaseClient: DatabaseClient,
  databaseTable: string
}): PaymentDatabaseController {
  /**
   * Finds an entry in the database.
   *
   * @param {string} paymentId
   * @return {
   *    Promise<PaymentWithoutPaymentCard | { error: string; }>
   * } - payment entry from database
   */
  async function findById(
      paymentId: string,
  ): Promise<PaymentWithoutPaymentCard | { error: string; }> {
    const resultRows: void | DatabaseQueryResults<PaymentDatabaseSchema> = await
    databaseClient.query(`
      SELECT * FROM ${databaseTable} WHERE id = $1
    `, [paymentId],
    ).catch((e: Error) => console.log(e));

    if (!resultRows) {
      return {error: 'No such payment found.'};
    }

    const result = resultRows.rows[0];
    return Object.freeze({
      id: result.id,
      orderId: result.order_id,
      paymentCardToken: result.payment_card_token,
      createdOn: result.created_on,
      completedOn: result.completed_on,
    });
  }

  /**
   * Inserts an entry in the database.
   *
   * @param {PaymentWithoutPaymentCard} {
   *     id,
   *     sender,
   *     receiver,
   *     source,
   *     createdOn,
   *   } - payment details
   * @return {string} - payment id
   */
  async function insert({
    id,
    orderId,
    paymentCardToken,
    createdOn,
    completedOn,
  }: PaymentWithoutPaymentCard): Promise<{ id: string } | { error: string; }> {
    const resultRows: void | DatabaseQueryResults<PaymentDatabaseSchema> = await
    databaseClient.query(`
      INSERT INTO ${databaseTable}
      (
        id,
        order_id,
        payment_card_token,
        created_on,
        completed_on
      )
      VALUES ($1, $2, $3, to_timestamp($4), to_timestamp($5))
      RETURNING id
    `, [
      id,
      orderId,
      paymentCardToken,
      createdOn,
      completedOn,
    ],
    ).catch((e: Error) => console.log(e));

    if (!resultRows) {
      return {error: 'Error creating payment.'};
    }

    const result = resultRows.rows[0];
    return {id: result.id};
  }

  return Object.freeze({
    findById: findById,
    insert: insert,
  });
}
