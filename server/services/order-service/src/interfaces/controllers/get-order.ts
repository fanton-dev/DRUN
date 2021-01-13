import {HttpRequest} from '../../../../core/global';

/**
 * Express controller for handling of GET "/order".
 *
 * @export
 * @param {Function} retrieveOrder - order retrieval dependency injection
 * @return {Function} - get order controller builder function
 */
export default function makeGetOrder({
  retrieveOrder,
}: {retrieveOrder: Function}) {
  return async function getOrder(httpRequest: HttpRequest) {
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      const getOrder = await retrieveOrder(
          httpRequest.query.orderId,
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
