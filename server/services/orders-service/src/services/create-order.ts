import {OrderExport} from '@core/@types/entity-exports';
import {OrderModel} from '@core/@types/models';
import {SharedQueue} from '@core/@types/shared-queue';
import makeOrder from '@src/order';
import config from 'config';
import {Knex} from 'knex';

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
  database,
}: {
  sharedQueue: SharedQueue;
  database: Knex;
}): Function {
  return async function createOrder(orderInfo: OrderModel) {
    let order: OrderExport;
    try {
      // Validating and storing the user
      order = makeOrder(orderInfo);
      await database('orders').insert({
        id: order.getId(),
        sender_id: order.getSender().getId(),
        sender_location_latitude:
          order.getSender().getLocation().getLatitude(),
        sender_location_longitude:
          order.getSender().getLocation().getLongitude(),
        receiver_id: order.getReceiver().getId(),
        receiver_location_latitude:
          order.getReceiver().getLocation().getLatitude(),
        receiver_location_longitude:
          order.getReceiver().getLocation().getLongitude(),
        source_ip: order.getSource().getIp(),
        source_browser: order.getSource().getBrowser(),
        source_referrer: order.getSource().getReferrer(),
      }).returning('id');

      // Emitting an 'ORDER_APPROVED' event in shared queue on valid order
      sharedQueue.emit([
        <string> config.get('INBOUND_PAYMENT_SERVICE_QUEUE'),
        <string> config.get('INBOUND_DELIVERY_SERVICE_QUEUE'),
        <string> config.get('INBOUND_LOGGER_SERVICE_QUEUE'),
      ], {
        subject: 'ORDER_ACCEPTED',
        body: order,
      });
    } catch (e) {
      // Emitting an 'ORDER_DECLINED' event in shared queue on invalid order
      sharedQueue.emit([
        <string> config.get('INBOUND_LOGGER_SERVICE_QUEUE'),
      ], {
        subject: 'ORDER_DECLINED',
        body: {orderId: orderInfo.id, error: e.message},
      });
      throw e;
    }

    return {id: order.getId(), ...orderInfo};
  };
}
