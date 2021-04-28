import {
  OrderLogsDatabaseController,
  QueueMessage,
} from '../../../core/@types/global';

/**
 * Stores a log message in the database corespondent database table.
 *
 * @export
 * @param {{orderLogsDatabase: OrderLogsDatabaseController}} {
 *   orderLogsDatabase,
 * } - dependency injection
 * @return {Function} - order logs retrieval function
 */
export default function buildStoreLogMessage({
  orderLogsDatabase,
}: {orderLogsDatabase: OrderLogsDatabaseController}): Function {
  return async function storeLogMessage(message: QueueMessage<any>) {
    switch (message.subject) {
      case 'ORDER_ACCEPTED':
      case 'ORDER_DECLINED':
      case 'PAYMENT_APPROVED':
      case 'PAYMENT_DENIED':
      case 'DELIVERY_ACCEPTED':
      case 'DELIVERY_DECLINED':
      case 'DELIVERY_COMPLETE':
      case 'DELIVERY_FAILED': {
        return await orderLogsDatabase.insert(message);
      }
    }
  };
}
