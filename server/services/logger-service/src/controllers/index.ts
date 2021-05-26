import notFound from '@core/controllers/not-found';
import {retrieveOrderLogs} from '@src/services';
import makeGetOrderLogs from './get-order-logs';

const getOrderLogs = makeGetOrderLogs({retrieveOrderLogs});

const orderController = Object.freeze({
  getOrder: getOrderLogs,
  notFound,
});

export default orderController;
export {getOrderLogs, notFound};
