import notFound from '@core/controllers/not-found';
import usecases from '../services';
import buildGetOrder from './get-orders-id';
import buildPostOrder from './post-orders';

const getOrder = buildGetOrder({retrieveOrder: usecases.retrieveOrder});
const postOrder = buildPostOrder({createOrder: usecases.createOrder});

const orderController = Object.freeze({
  getOrder,
  postOrder,
  notFound,
});

export default orderController;
export {getOrder, postOrder, notFound};
