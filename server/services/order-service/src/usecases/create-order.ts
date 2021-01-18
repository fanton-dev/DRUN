import {
  Order,
  SharedQueue,
  DatabaseController,
} from '../../../core/@types/global';
import makeOrder from '../entities/order';

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
    const orderDecompressed = {
      id: order.getId(),
      senderId: order.getSenderId(),
      senderLocation: order.getSenderLocation(),
      receiverId: order.getReceiverId(),
      receiverLocation: order.getReceiverLocation(),
      sourceIp: order.getSource().getIp(),
      sourceBrowser: order.getSource().getBrowser(),
      sourceReferrer: order.getSource().getReferrer(),
      createdOn: order.getCreatedOn(),
    };
    sharedQueue.emit('ORDER_APPROVED', {
      ...orderDecompressed,
      ...{
        paymentCardNumber: order.getPaymentCardNumber(),
        paymentCardDate: order.getPaymentCardDate(),
        paymentCardCVC: order.getPaymentCardCVC(),
      },
    });

    // Creating an entry in local database
    ordersDatabase.insert({
      id: `'${order.getId()}'`,
      sender_id: `'${order.getSenderId()}'`,
      sender_location_latitude: order.getSenderLocation().latitude,
      sender_location_longitude: order.getSenderLocation().longitude,
      receiver_id: `'${order.getReceiverId()}'`,
      receiver_location_latitude: order.getReceiverLocation().latitude,
      receiver_location_longitude: order.getReceiverLocation().longitude,
      source_ip: `'${order.getSource().getIp()}'`,
      source_browser: `'${order.getSource().getBrowser()}'`,
      source_referrer: `'${order.getSource().getReferrer()}'`,
      created_on: `to_timestamp(${order.getCreatedOn()})`,
    });

    return orderDecompressed;
  };
}
