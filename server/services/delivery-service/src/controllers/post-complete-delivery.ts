import {ControllerRequest} from '@core/@types/controllers';

/**
 * Express controller for handling of POST "/drones".
 *
 * @export
 * @param {{completeDelivery: Function}} {
 *   completeDelivery
 * } - dependency injection
 * @return {Function} - post drone controller builder function
 */
export default function makePostCompleteDelivery({
  completeDelivery,
}: {completeDelivery: Function}): Function {
  return async function postCompleteDelivery(
      controllerRequest: ControllerRequest,
  ) {
    try {
      await completeDelivery(
          controllerRequest.body['deliveryId'], controllerRequest.ip);
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 201,
        body: {status: 'OK'},
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
