import express from 'express';
import bodyParser from 'body-parser';
import makeExpressCallback from '../../core/express-callback';
import config from '../../core/config';
import {
  postAuthenticateSendSms,
  postAuthenticateVerifyCode,
  notFound,
} from './interfaces/controllers';
import sharedQueue from '../../core/interfaces/shared-queue';
import {QueueMessage, UserTokenVerificationRequest, UserTokenVerificationResponse} from '../../core/@types/global';
import {isUserIdToTokenValid} from './usecases';

const apiRoot = config.apiRoot;
const app = express();
app.use(bodyParser.json());

app.post(
    `${apiRoot}/users/authenticate/send-sms-code`,
    makeExpressCallback(postAuthenticateSendSms),
);
app.post(
    `${apiRoot}/users/authenticate/verify-sms-code`,
    makeExpressCallback(postAuthenticateVerifyCode),
);

app.use(makeExpressCallback(notFound));

setTimeout(() => sharedQueue.listen(
    config.inboundPaymentServiceQueue,
    async (message: QueueMessage<UserTokenVerificationRequest>) => {
      if (message.subject === 'USER_TOKEN_VERIFICATION_REQUEST') {
        sharedQueue.emit<UserTokenVerificationResponse>(
            [config.inboundOrderServiceQueue], {
              subject: 'USER_TOKEN_VERIFICATION_RESPONSE',
              body: isUserIdToTokenValid(message.body) ?
                {isValid: true, ...message.body} :
                {isValid: false, ...message.body},
            },
        );
      }
    },
), 10000);

app.listen(3004, () => {
  console.log('Users service started on "/api/users"...');
});

export default app;
