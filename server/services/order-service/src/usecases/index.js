import buildRetrieveOrder from './create-order';
import buildMakeOrder from './make-order';
import orderController from '../interfaces/controllers';

const retrieveOrder = buildRetrieveOrder(orderController);
const makeOrder = buildMakeOrder(sharedQueue, ordersDatabase);

const ordersService = Object.freeze({
  retrieveOrder,
  makeOrder,
});

export default ordersService;
export {retrieveOrder, makeOrder};
