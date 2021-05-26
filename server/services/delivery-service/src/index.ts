import {OrderModel, PaymentModel} from '@core/@types/models';
import {QueueMessage} from '@core/@types/shared-queue';
import makeExpressCallback from '@core/controllers/express-callback';
import sharedQueue from '@core/shared-queue';
import {
  deleteDrone,
  notFound, postCompleteDelivery, postDrone
} from '@src/controllers';
import {createDelivery} from '@src/services';
import bodyParser from 'body-parser';
import config from 'config';
import express from 'express';

const apiRoot = config.get('API_ROOT');
const app = express();
app.use(bodyParser.json());

app.post(`${apiRoot}/drones`, makeExpressCallback(postDrone));
app.delete(`${apiRoot}/drones`, makeExpressCallback(deleteDrone));
app.post(`${apiRoot}/drones`, makeExpressCallback(postCompleteDelivery));
app.use(makeExpressCallback(notFound));

const ordersToProcess: Array<OrderModel> = [];
setTimeout(() => sharedQueue.listen(
    config.get('INBOUND_DELIVERY_SERVICE_QUEUE'),
    async (message: QueueMessage<OrderModel | PaymentModel>) => {
      switch (message.subject) {
        case 'ORDER_ACCEPTED':
          // @ts-ignore - only order service emits Order objects
          ordersToProcess.push(message.body);
          break;

        case 'PAYMENT_APPROVED':
          const order = ordersToProcess.find(
              // @ts-ignore - only payment service emits Payment objects
              (i) => i.id === message.body.orderId,
          );
          createDelivery({
            orderId: order?.id,
            senderLocation: order?.sender.location,
            receiverLocation: order?.receiver.location,
          });
          break;
      }
    },
), 20000);


app.listen(3002, () => {
  console.log('Delivery service started successfully.');
});

export default app;
