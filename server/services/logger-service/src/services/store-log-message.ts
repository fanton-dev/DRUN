import {QueueMessage} from '@core/@types/shared-queue';
import {Knex} from 'knex';

/**
 * Stores a log message in the database corespondent database table.
 *
 * @export
 * @param {{database: Knex}} {
 *   database,
 * } - dependency injection
 * @return {Function} - order logs retrieval function
 */
export default function buildStoreLogMessage({
  database,
}: {database: Knex}): Function {
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
        return await database('order_logs').insert({
          orderId: message.body.orderId,
          subject: message.subject,
        });
      }
    }
  };
}
