import {QueueMessage} from '../../core/@types/global';
import config from '../../core/config';
import sharedQueue from '../../core/interfaces/shared-queue';
import {createPayment} from './usecases';

setTimeout(() => sharedQueue.listen(
    config.inboundPaymentServiceQueue,
    async (message: QueueMessage) => {
      if (message.subject === 'ORDER_ACCEPTED') createPayment(message.body);
    },
), 10000);

console.log('Payment service started...');
