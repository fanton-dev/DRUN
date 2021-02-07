import {OrderLogsDatabaseController} from '../../core/@types/global';

/**
 * Retrieves logs for a concrete order from the database.
 *
 * @export
 * @param {{ordersDatabase: OrderLogsDatabaseController}} {
 *   ordersDatabase,
 * } - dependency injection
 * @return {Function} - order logs retrieval function
 */
export default function buildRetrieveOrderLogs({
  ordersDatabase,
}: {ordersDatabase: OrderLogsDatabaseController}): Function {
  return async function retrieveOrder(orderId: string) {
    return await ordersDatabase.findLogsOfOrder(orderId);
  };
}
