import {OrderDatabaseController} from '../../../core/@types/global';

/**
 * Retrieves information for a concrete order from the database.
 *
 * @export
 * @param {{ordersDatabase: OrderDatabaseController}} {
 *   ordersDatabase,
 * } - dependency injection
 * @return {Function} - order retrieval function
 */
export default function buildRetrieveOrder({
  ordersDatabase,
}: {ordersDatabase: OrderDatabaseController}): Function {
  return async function retrieveOrder(orderId: string) {
    return await ordersDatabase.findById(orderId);
  };
}
