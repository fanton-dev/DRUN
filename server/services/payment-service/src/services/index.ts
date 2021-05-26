import sharedQueue from '@core/shared-queue';
import paymentApi from '../payment-api';
import buildCreatePayment from './create-payment';

const createPayment = buildCreatePayment({
  paymentApi,
  sharedQueue,
});

const ordersService = Object.freeze({
  createPayment: createPayment,
});

export default ordersService;
export {createPayment};
