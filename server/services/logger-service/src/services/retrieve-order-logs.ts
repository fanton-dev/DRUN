import {Knex} from 'knex';

/**
 * Retrieves logs for a concrete order from the database.
 *
 * @export
 * @param {{database: Knex}} {
 *   database,
 * } - dependency injection
 * @return {Function} - order logs retrieval function
 */
export default function buildRetrieveOrderLogs({
  database,
}: {database: Knex}): Function {
  return async function retrieveOrder(orderId: string) {
    return await database.where({orderId: orderId});
  };
}
