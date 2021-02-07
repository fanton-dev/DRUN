import {DatabaseClient, Order} from '../../../core/@types/global';
import PgMock2 from 'pgmock2';

/**
 * Provides a builder for fake database client.
 *
 * @export
 * @param {Order} order
 * @return {DatabaseClient}
 */
export default function makeFakeDatabaseClient(order: Order): DatabaseClient {
  const client = new PgMock2();
  client.add(`
    SELECT * FROM orders WHERE id = $1
  `, ['string'], {
    rowCount: 1,
    rows: [{
      'id': order.id,
      'sender_id': order.sender.id,
      'sender_location_latitude': order.sender.location.latitude,
      'sender_location_longitude': order.sender.location.longitude,
      'receiver_id': order.receiver.id,
      'receiver_location_latitude': order.receiver.location.latitude,
      'receiver_location_longitude': order.receiver.location.longitude,
      'source_ip': order.source.ip,
      'source_browser': order.source.browser,
      'source_referrer': order.source.referrer,
      'created_on': order.createdOn,
    }],
  });

  client.add(`
    INSERT INTO orders
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
    'string', 'string', 'number', 'number', 'string', 'number', 'number',
    'string', 'string', 'string', 'number',
  ], {rowCount: 1, rows: [{id: order.id}]});

  return client;
}
