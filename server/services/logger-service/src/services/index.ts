import database from '@src/database';
import buildRetrieveOrderLogs from './retrieve-order-logs';
import buildStoreLogMessage from './store-log-message';

const retrieveOrderLogs = buildRetrieveOrderLogs({database});
const storeLogMessage = buildStoreLogMessage({database});

const ordersService = Object.freeze({
  retrieveOrderLogs,
  storeLogMessage,
});

export default ordersService;
export {retrieveOrderLogs, storeLogMessage};
