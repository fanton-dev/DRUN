import {
  Order,
  SharedQueue,
  DatabaseController,
} from '../../../core/@types/global';
import makeOrder, {decompressOrder} from '../entities/order';

/**
 * Handles a user order request, stores it in local db and notifies other
 * services about it.
 *
 * @export
 * @param {{sharedQueue: SharedQueue, ordersDatabase: DatabaseController}} {
 *   sharedQueue,
 *   ordersDatabase,
 * } - dependency injection
 * @return {Function} - order creation function
 */
export default function buildCreateOrder({
  sharedQueue,
  ordersDatabase,
}: {sharedQueue: SharedQueue, ordersDatabase: DatabaseController}): Function {
  return async function createOrder(orderInfo: Order) {
    // Internal parameter
    let order;

    // Emitting an 'ORDER_DENIED' event in shared queue on invalid order
    try {
      order = makeOrder(orderInfo);
    } catch (e) {
      sharedQueue.emit('ORDER_DENIED', e.message);
      throw e;
    }

    // Emitting an 'ORDER_APPROVED' event in shared queue on valid order
    const decompressedOrder = decompressOrder(order);
    sharedQueue.emit('ORDER_APPROVED', decompressedOrder);

    // Creating an entry in local database
    return ordersDatabase.insert(decompressedOrder);
  };
}
