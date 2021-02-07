import express from 'express';
import bodyParser from 'body-parser';
import config from '../core/config';
import makeExpressCallback from '../core/express-callback';
import sharedQueue from '../core/interfaces/shared-queue';
import {QueueMessage, Order} from '../core/@types/global';
import {getOrderLogs, notFound} from './interfaces/controllers';
import {storeLogMessage} from './usecases';

const apiRoot = config.apiRoot;
const app = express();
app.use(bodyParser.json());

app.get(`${apiRoot}/logs/order`, makeExpressCallback(getOrderLogs));

app.use(makeExpressCallback(notFound));

setTimeout(() => sharedQueue.listen(
    config.inboundPaymentServiceQueue,
    async (message: QueueMessage<Order>) => {
      storeLogMessage(message);
    },
), 10000);

app.listen(3002, () => {
  console.log('Logger service started on "/api/logs"...');
});
