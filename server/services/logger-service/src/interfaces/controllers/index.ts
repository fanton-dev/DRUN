import {retrieveOrderLogs} from '../../usecases';
import makeGetOrderLogs from './get-order-logs';
import notFound from '../../../../core/interfaces/controllers/not-found';

const getOrderLogs = makeGetOrderLogs({retrieveOrderLogs});

const orderController = Object.freeze({
  getOrder: getOrderLogs,
  notFound,
});

export default orderController;
export {getOrderLogs, notFound};
