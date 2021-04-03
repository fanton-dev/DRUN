import makeExpressCallback from '@core/controllers/express-callback';
import bodyParser from 'body-parser';
import config from 'config';
import express from 'express';
import controllers from './controllers';

const apiRoot = <string> config.get('API_ROOT');
const app = express();
app.use(bodyParser.json());

app.get(`${apiRoot}/orders/:id`, makeExpressCallback(controllers.getOrder));
app.post(`${apiRoot}/orders`, makeExpressCallback(controllers.postOrder));

app.use(makeExpressCallback(controllers.notFound));

app.listen(3001, () => {
  console.log('Orders service started successfully.');
});

export default app;
