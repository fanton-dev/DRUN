import buildRetrieveOrderLogs from './retrieve-order-logs';
import buildStoreLogMessage from './store-log-message';
import orderLogsDatabase from '../interfaces/order-logs-database';

const retrieveOrderLogs = buildRetrieveOrderLogs({orderLogsDatabase});
const storeLogMessage = buildStoreLogMessage({orderLogsDatabase});

const ordersService = Object.freeze({
  retrieveOrderLogs,
  storeLogMessage,
});

export default ordersService;
export {retrieveOrderLogs, storeLogMessage};
