import 'reflect-metadata';
import config from 'config';
import express from 'express';
import bodyParser from 'body-parser';
import controllers from './controllers';
import sharedQueue from '../core/shared-queue';
import makeExpressCallback from '../core/controllers/express-callback';
import {isUserIdToTokenValid} from './usecases';
import {QueueMessage} from '../core/@types/shared-queue';
import {initConnection} from './database';

initConnection().then(async (conn) => await conn.runMigrations());

const apiRoot = config.get('API_ROOT');
const app = express();
app.use(bodyParser.json());

app.post(
    `${apiRoot}/users/authenticate/send-sms-code`,
    makeExpressCallback(controllers.postAuthenticateSendSmsCode),
);
app.post(
    `${apiRoot}/users/authenticate/verify-sms-code`,
    makeExpressCallback(controllers.postAuthenticateVerifySmsCode),
);

app.use(makeExpressCallback(controllers.notFound));

setTimeout(() => sharedQueue.listen(
    config.get('INBOUND_PAYMENT_SERVICE_QUEUE'),
    async (message: QueueMessage<any>) => {
      if (message.subject === 'USER_TOKEN_VERIFICATION_REQUEST') {
        sharedQueue.emit<QueueMessage<any>>([
          config.get('INBOUND_ORDER_SERVICE_QUEUE'),
        ], {
          subject: 'USER_TOKEN_VERIFICATION_RESPONSE',
          body: isUserIdToTokenValid(message.body) ?
                {isValid: true, ...message.body} :
                {isValid: false, ...message.body},
        });
      }
    },
), 20000);

app.listen(3004, () => {
  console.log('Users service started successfully.');
});

export default app;
