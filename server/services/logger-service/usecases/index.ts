import buildRetrieveOrderLogs from './retrieve-order-logs';
import buildStoreLogMessage from './store-log-message';
import logsDatabase from '../interfaces/logs-database';

const retrieveOrderLogs = buildRetrieveOrderLogs({logsDatabase});
const storeLogMessage = buildStoreLogMessage({logsDatabase});

const ordersService = Object.freeze({
  retrieveOrderLogs,
  storeLogMessage,
});

export default ordersService;
export {retrieveOrderLogs, storeLogMessage};
