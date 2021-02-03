import express from 'express';
import bodyParser from 'body-parser';
import makeExpressCallback from '../../core/express-callback';
import {postDrone, deleteDrone, notFound} from './interfaces/controllers';
import config from '../../core/config';

const apiRoot = config.apiRoot;
const app = express();
app.use(bodyParser.json());

app.post(`${apiRoot}/drones`, makeExpressCallback(postDrone));
app.delete(`${apiRoot}/drones`, makeExpressCallback(deleteDrone));
app.use(makeExpressCallback(notFound));

app.listen(3002, () => {
  console.log('Delivery service started on "/api/deliveries"...');
});

export default app;
