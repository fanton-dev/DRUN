import {
  Order,
  SharedQueue,
  OrderDatabaseController,
  OrderExport,
} from '../../../core/@types/global';
import makeOrder from '../entities/order';
import config from '../../../core/config';

/**
 * Handles a user order request, stores it in local db and notifies other
 * services about it.
 *
 * @export
 * @param {{
 *   sharedQueue: SharedQueue,
 *   ordersDatabase: OrderDatabaseController,
 *   exportToNormalEntity: Function,
 * }} {
 *   sharedQueue,
 *   ordersDatabase,
 *   exportToNormalEntity,
 * } - dependency injection
 * @return {Function} - order creation function
 */
export default function buildCreateOrder({
  sharedQueue,
  ordersDatabase,
  exportToNormalEntity,
}: {
  sharedQueue: SharedQueue;
  ordersDatabase: OrderDatabaseController;
  exportToNormalEntity<T extends Object, U extends Object>(object: T): U;
}): Function {
  return async function createOrder(orderInfo: Order) {
    // Internal parameter
    let order;

    // Emitting an 'ORDER_DECLINED' event in shared queue on invalid order
    try {
      order = makeOrder(orderInfo);
    } catch (e) {
      sharedQueue.emit([
        config.inboundLoggerServiceQueue,
      ], {
        subject: 'ORDER_DECLINED',
        body: e.message,
      });
      throw e;
    }

    // Emitting an 'ORDER_APPROVED' event in shared queue on valid order
    const decompressedOrder = exportToNormalEntity<OrderExport, Order>(order);
    sharedQueue.emit([
      config.inboundPaymentServiceQueue,
      config.inboundDeliveryServiceQueue,
      config.inboundLoggerServiceQueue,
    ], {
      subject: 'ORDER_ACCEPTED',
      body: decompressedOrder,
    });

    // Creating an entry in local database
    return ordersDatabase.insert(decompressedOrder);
  };
}
