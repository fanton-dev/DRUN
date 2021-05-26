import {ControllerRequest} from '@core/@types/controllers';

/**
 * Express controller for handling of GET "/logs/order".
 *
 * @export
 * @param {Function} retrieveOrderLogs - order logs retrieval dependency
 * @return {Function} - get order logs controller builder function
 */
export default function makeGetOrderLogs({
  retrieveOrderLogs,
}: {retrieveOrderLogs: Function}): Function {
  return async function getOrderLogs(controllerRequest: ControllerRequest) {
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      const getOrder = await retrieveOrderLogs(
          controllerRequest.query.orderId,
      );
      return {
        headers,
        statusCode: 200,
        body: getOrder,
      };
    } catch (e) {
      return {
        headers,
        statusCode: 400,
        body: {
          error: e.message,
        },
      };
    }
  };
}
