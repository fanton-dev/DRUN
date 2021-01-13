import express from 'express';
import bodyParser from 'body-parser';
import makeExpressCallback from '../../core/express-callback';
import config from '../../core/config';
import {
  getOrder,
  postOrder,
  notFound,
} from './interfaces/controllers';

const apiRoot = config.apiRoot;
const app = express();
app.use(bodyParser.json());

app.get(`${apiRoot}/orders`, makeExpressCallback(getOrder));
app.post(`${apiRoot}/orders`, makeExpressCallback(postOrder));

app.use(makeExpressCallback(notFound));

app.listen(3001, () => {
  console.log('Order service started on "/api/orders"...');
});

export default app;
