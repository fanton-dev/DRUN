import sharedQueue from '@core/shared-queue';
import database from '@src/database';
import buildCreateOrder from './create-order';
import buildRetrieveOrder from './retrieve-order';

const retrieveOrder = buildRetrieveOrder({
  database,
});

const createOrder = buildCreateOrder({
  sharedQueue,
  database,
});

const usecases = Object.freeze({
  retrieveOrder,
  createOrder: createOrder,
});

export default usecases;
export {retrieveOrder, createOrder};
