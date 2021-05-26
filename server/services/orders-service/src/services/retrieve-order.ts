import {Knex} from 'knex';

/**
 * Retrieves information for a concrete order from the database.
 *
 * @export
 * @param {Function} {
 *   getOrderRepository,
 * } - dependency injection
 * @return {Function} - order retrieval function
 */
export default function buildRetrieveOrder({
  database,
}: {database: Knex}): Function {
  return async function retrieveOrder(orderId: string) {
    try {
      return await database('orders')
          .where({id: orderId})
          .returning('id');
    } catch (e) {
      throw new Error('No such order.');
    }
  };
}
