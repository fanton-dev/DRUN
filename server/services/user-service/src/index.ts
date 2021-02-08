import express from 'express';
import bodyParser from 'body-parser';
import makeExpressCallback from '../../core/express-callback';
import config from '../../core/config';
import {
  postAuthenticateSendSms,
  postAuthenticateVerifyToken,
  notFound,
} from './interfaces/controllers';

const apiRoot = config.apiRoot;
const app = express();
app.use(bodyParser.json());

app.post(
    `${apiRoot}/users/authenticate/step1`,
    makeExpressCallback(postAuthenticateSendSms),
);
app.post(
    `${apiRoot}/users/authenticate/step1`,
    makeExpressCallback(postAuthenticateVerifyToken),
);
app.use(makeExpressCallback(notFound));

app.listen(3004, () => {
  console.log('Users service started on "/api/users"...');
});

export default app;
