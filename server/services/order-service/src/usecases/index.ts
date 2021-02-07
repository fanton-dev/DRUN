import buildRetrieveOrder from './retrieve-order';
import buildCreateOrder from './create-order';
import ordersDatabase from '../interfaces/orders-database';
import sharedQueue from '../../../core/interfaces/shared-queue';
import {exportToNormalEntity} from '../../../core/entities/utilities';

const retrieveOrder = buildRetrieveOrder({ordersDatabase});
const createOrder = buildCreateOrder({
  sharedQueue,
  ordersDatabase,
  exportToNormalEntity,
});

const ordersService = Object.freeze({
  retrieveOrder,
  makeOrder: createOrder,
});

export default ordersService;
export {retrieveOrder, createOrder};
