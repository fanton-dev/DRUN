import {ControllerRequest} from '@core/@types/controllers';

/**
 * Express controller for handling of POST "/orders".
 *
 * @export
 * @param {{createOrder: Function}} {
 *   createOrder
 * } - dependency injection
 * @return {Function} - post orders controller builder function
 */
export default function buildPostOrder({
  createOrder,
}: {createOrder: Function}): Function {
  return async function postOrder(controllerRequest: ControllerRequest) {
    try {
      const {source = {}, ...orderInfo} = controllerRequest.body;
      source.ip = controllerRequest.ip;
      source.browser = controllerRequest.headers['User-Agent'];
      if (controllerRequest.headers['Referer']) {
        source.referrer = controllerRequest.headers['Referer'];
      }

      const order = await createOrder({...orderInfo, source});

      return {
        headers: {'Content-Type': 'application/json'},
        statusCode: 201,
        body: order,
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
