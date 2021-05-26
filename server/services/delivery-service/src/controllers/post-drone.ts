import {ControllerRequest} from '@core/@types/controllers';

/**
 * Express controller for handling of POST "/drones".
 *
 * @export
 * @param {{createDrone: Function}} {
 *   createDrone
 * } - dependency injection
 * @return {Function} - post drone controller builder function
 */
export default function makePostDrone({
  connectDrone,
}: {connectDrone: Function}): Function {
  return async function postDrone(controllerRequest: ControllerRequest) {
    try {
      const {source = {}, ...droneInfo} = controllerRequest.body;
      source.ip = controllerRequest.ip;
      source.browser = controllerRequest.headers['User-Agent'];
      if (controllerRequest.headers['Referer']) {
        source.referrer = controllerRequest.headers['Referer'];
      }
      const drone = await connectDrone({...droneInfo, source});
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 201,
        body: {drone},
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
