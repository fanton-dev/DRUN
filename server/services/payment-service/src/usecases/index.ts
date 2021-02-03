import buildCreatePayment from './create-payment';
import paymentApi from '../interfaces/payment-api';
import sharedQueue from '../../../core/interfaces/shared-queue';
import paymentsDatabase from '../interfaces/payments-database';

const createPayment = buildCreatePayment({
  paymentApi,
  sharedQueue,
  paymentsDatabase,
});

const ordersService = Object.freeze({
  createPayment: createPayment,
});

export default ordersService;
export {createPayment};
