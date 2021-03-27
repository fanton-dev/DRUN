import {OrderModel} from '@core/@types/models';
import {QueueMessage} from '@core/@types/shared-queue';
import sharedQueue from '@core/shared-queue';
import config from 'config';
import services from './services';

setTimeout(() => sharedQueue.listen(
    config.get('INBOUND_PAYMENT_SERVICE_QUEUE'),
    async (message: QueueMessage<OrderModel>) => {
      if (message.subject === 'ORDER_ACCEPTED') {
        services.createPayment(message.body);
      }
    },
), 20000);

console.log('Payment service started successfully.');
