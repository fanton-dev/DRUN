import {Order, QueueMessage} from '../../core/@types/global';
import config from '../../core/config';
import sharedQueue from '../../core/interfaces/shared-queue';
import {createPayment} from './usecases';

setTimeout(() => sharedQueue.listen(
    config.inboundPaymentServiceQueue,
    async (message: QueueMessage<Order>) => {
      if (message.subject === 'ORDER_ACCEPTED') createPayment(message.body);
    },
), 20000);

console.log('Payment service started...');
