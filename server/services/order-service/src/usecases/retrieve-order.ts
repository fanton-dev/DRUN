import {DatabaseController} from '../../../core/@types/global';

/**
 * Retrieves information for a concrete order from the database.
 *
 * @export
 * @param {{ordersDatabase: DatabaseController}} {
 *   ordersDatabase,
 * } - dependency injection
 * @return {Function} - order retrieval function
 */
export default function buildRetrieveOrder({
  ordersDatabase,
}: {ordersDatabase: DatabaseController}): Function {
  return async function retrieveOrder(orderId: String) {
    return await ordersDatabase.findById(orderId);
  };
}
