import buildRetrieveOrder from './retrieve-order';
import buildCreateOrder from './create-order';
import ordersDatabase from '../interfaces/orders-database';
import sharedQueue from '../../../core/interfaces/shared-queue';

const retrieveOrder = buildRetrieveOrder({ordersDatabase});
const createOrder = buildCreateOrder({sharedQueue, ordersDatabase});

const ordersService = Object.freeze({
  retrieveOrder,
  makeOrder: createOrder,
});

export default ordersService;
export {retrieveOrder, createOrder};
