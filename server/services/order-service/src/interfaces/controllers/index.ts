import {retrieveOrder, createOrder} from '../../usecases';
import makeGetOrder from './get-order';
import makePostOrder from './post-order';
import notFound from './not-found';

const getOrder = makeGetOrder({retrieveOrder});
const postOrder = makePostOrder({createOrder});

const orderController = Object.freeze({
  getOrder,
  postOrders,
  notFound,
});

export default orderController;
export {getOrder, postOrder, notFound};
