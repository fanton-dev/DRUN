import {QueueMessage} from '@core/@types/shared-queue';
import makeExpressCallback from '@core/controllers/express-callback';
import sharedQueue from '@core/shared-queue';
import {getOrderLogs, notFound} from '@src/controllers';
import {storeLogMessage} from '@src/services';
import config from 'config';
import express from 'express';

const apiRoot = <string> config.get('API_ROOT');
const app = express();

app.get(`${apiRoot}/logs/order`, makeExpressCallback(getOrderLogs));

app.use(makeExpressCallback(notFound));

setTimeout(() => sharedQueue.listen(
    config.get('INBOUND_LOGGER_SERVICE_QUEUE'),
    async (message: QueueMessage<any>) => storeLogMessage(message),
), 20000);

app.listen(3003, () => {
  console.log('Logger service started successfully.');
});
