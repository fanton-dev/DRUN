import express from 'express';
import bodyParser from 'body-parser';
import makeExpressCallback from '../../core/express-callback';
import {
  postDrone,
  deleteDrone,
  postCompleteDelivery,
  notFound,
} from './interfaces/controllers';
import config from '../../core/config';
import sharedQueue from '../../core/interfaces/shared-queue';
import {Order, Payment, QueueMessage} from '../../core/@types/global';
import {createDelivery} from './usecases';

const apiRoot = config.apiRoot;
const app = express();
app.use(bodyParser.json());

app.post(`${apiRoot}/drones`, makeExpressCallback(postDrone));
app.delete(`${apiRoot}/drones`, makeExpressCallback(deleteDrone));
app.post(`${apiRoot}/drones`, makeExpressCallback(postCompleteDelivery));
app.use(makeExpressCallback(notFound));

const ordersToProcess: Array<Order> = [];
setTimeout(() => sharedQueue.listen(
    config.inboundDeliveryServiceQueue,
    async (message: QueueMessage<Order | Payment>) => {
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
), 10000);


app.listen(3002, () => {
  console.log('Delivery service started on "/api/deliveries"...');
});

export default app;
