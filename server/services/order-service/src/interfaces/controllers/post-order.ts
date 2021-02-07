import {HttpRequest} from '../../../../core/@types/global';

/**
 * Express controller for handling of POST "/order".
 *
 * @export
 * @param {{createOrder: Function}} {
 *   createOrder
 * } - dependency injection
 * @return {Function} - post order controller builder function
 */
export default function makePostOrder({
  createOrder,
}: {createOrder: Function}): Function {
  return async function postOrder(httpRequest: HttpRequest) {
    try {
      const {source = {}, ...orderInfo} = httpRequest.body;
      source.ip = httpRequest.ip;
      source.browser = httpRequest.headers['User-Agent'];
      if (httpRequest.headers['Referer']) {
        source.referrer = httpRequest.headers['Referer'];
      }
      const order = await createOrder({...orderInfo, source});
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 201,
        body: {order},
      };
    } catch (e) {
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: {
          error: e.message,
        },
      };
    }
  };
}
