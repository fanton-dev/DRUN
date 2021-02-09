import express from 'express';
import bodyParser from 'body-parser';
import makeExpressCallback from '../../core/express-callback';
import config from '../../core/config';
import {
  postAuthenticateSendSms,
  postAuthenticateVerifyCode,
  notFound,
} from './interfaces/controllers';

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

app.listen(3004, () => {
  console.log('Users service started on "/api/users"...');
});

export default app;
