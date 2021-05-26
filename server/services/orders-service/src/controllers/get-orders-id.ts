import {ControllerRequest} from '@core/@types/controllers';

/**
 * Express controller for handling of GET "/order/:id".
 *
 * @export
 * @param {Function} retrieveOrder - order retrieval dependency injection
 * @return {Function} - get orders controller builder function
 */
export default function buildGetOrder({
  retrieveOrder,
}: {
  retrieveOrder: Function
}): (controllerRequest: ControllerRequest) => object {
  return async function getOrder(controllerRequest: ControllerRequest) {
    try {
      const orderId = controllerRequest.params?.id;
      const getOrder = await retrieveOrder(orderId);
      return {
        headers: {'Content-Type': 'application/json'},
        statusCode: 200,
        body: getOrder,
      };
    } catch (e) {
      return {
        headers: {'Content-Type': 'application/json'},
        statusCode: 400,
        body: {error: e.message},
      };
    }
  };
}
