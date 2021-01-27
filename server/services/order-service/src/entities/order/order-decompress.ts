import {Order, OrderExport} from '../../../../core/@types/global';

/**
 * Converts an order to
 *
 * @export
 * @param {OrderExport} order - exported order
 * @return {Order} -
 */
export default function decompressedOrder(order: OrderExport): Order {
  return {
    id: order.getId(),
    sender: {
      id: order.getSender().getId(),
      location: {
        latitude: order.getSender().getLocation().getLatitude(),
        longitude: order.getSender().getLocation().getLongitude(),
      },
    },
    receiver: {
      id: order.getReceiver().getId(),
      location: {
        latitude: order.getReceiver().getLocation().getLatitude(),
        longitude: order.getReceiver().getLocation().getLongitude(),
      },
    },
    paymentCard: {
      number: order.getPaymentCard().getNumber(),
      date: order.getPaymentCard().getDate(),
      CVC: order.getPaymentCard().getCVC(),
    },
    source: {
      ip: order.getSource().getIp(),
      browser: order.getSource().getBrowser(),
      referrer: order.getSource().getReferrer(),
    },
    createdOn: order.getCreatedOn(),
  };
}
