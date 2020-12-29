import makeOrder from '../entities/order';

/**
 * Handles a user order request, stores it in local db and notifies other
 * services about it.
 *
 * @export
 * @param {Object} sharedQueue - shared ms working queue dependency injection
 * @param {Object} ordersDatabase - local service database dependency injection
 * @return {Function} - order creation function
 */
export default function buildCreateOrder(sharedQueue, ordersDatabase) {
  return async function createOrder(orderInfo) {
    let order;

    // Emitting an 'ORDER_DENIED' event in shared queue on invalid order
    try {
      order = makeOrder(orderInfo);
    } finally {
      sharedQueue.emit('ORDER_DENIED', err.message);
    }

    // Emitting an 'ORDER_APPROVED' event in shared queue on valid order
    sharedQueue.emit('ORDER_APPROVED', {
      id: order.getId(),
      senderId: order.getSenderId(),
      senderLocation: order.getSenderLocation(),
      receiverId: order.getReceiverId(),
      receiverLocation: order.getReceiverLocation(),
      paymentCardNumber: getPaymentCardNumber(),
      paymentCardDate: getPaymentCardDate(),
      paymentCardCVC: getPaymentCardCVC(),
      createdOn: order.getCreatedOn(),
    });

    // Creating an entry in local database
    return ordersDatabase.insert({
      id: order.getId(),
      senderId: order.getSenderId(),
      senderLocation: order.getSenderLocation(),
      receiverId: order.getReceiverId(),
      receiverLocation: order.getReceiverLocation(),
      createdOn: order.getCreatedOn(),
    });
  };
}
