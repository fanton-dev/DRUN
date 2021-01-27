import express from 'express';
import bodyParser from 'body-parser';
import makeExpressCallback from '../../core/express-callback';

const app = express();
app.use(bodyParser.json());

const dummy = async () => {
  return Object.freeze({});
};

app.post('/drones/connect', makeExpressCallback(dummy));

// app.use(makeExpressCallback(notFound));

app.listen(3002, () => {
  console.log('Delivery service started on "/api/deliveries"...');
});

export default app;
