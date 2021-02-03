import {DatabaseClient, Payment} from '../../../core/@types/global';
import PgMock2 from 'pgmock2';

/**
 * Provides a builder for fake database client.
 *
 * @export
 * @param {Payment} payment
 * @return {DatabaseClient}
 */
export default function makeFakeDatabaseClient(
    payment: Payment,
): DatabaseClient {
  const client = new PgMock2();
  client.add(`
    SELECT * FROM payments WHERE id = $1
  `, ['string'], {
    rowCount: 1,
    rows: [{
      'id': payment.id,
      'order_id': payment.orderId,
      'payment_card_token': payment.paymentCardToken,
      'created_on': payment.createdOn,
      'completed_on': payment.completedOn,
    }],
  });

  client.add(`
    INSERT INTO payments
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
    'string', 'string', 'string', 'number', 'number',
  ], {rowCount: 1, rows: [{id: payment.id}]});

  return client;
}
