import {OrderLogsDatabaseController} from '../../core/@types/global';

/**
 * Retrieves logs for a concrete order from the database.
 *
 * @export
 * @param {{orderLogsDatabase: OrderLogsDatabaseController}} {
 *   orderLogsDatabase,
 * } - dependency injection
 * @return {Function} - order logs retrieval function
 */
export default function buildRetrieveOrderLogs({
  orderLogsDatabase,
}: {orderLogsDatabase: OrderLogsDatabaseController}): Function {
  return async function retrieveOrder(orderId: string) {
    return await orderLogsDatabase.findLogsOfOrder(orderId);
  };
}
