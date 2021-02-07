import {HttpRequest} from '../../../../core/@types/global';

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
  return async function postDrone(httpRequest: HttpRequest) {
    try {
      const {source = {}, ...droneInfo} = httpRequest.body;
      source.ip = httpRequest.ip;
      source.browser = httpRequest.headers['User-Agent'];
      if (httpRequest.headers['Referer']) {
        source.referrer = httpRequest.headers['Referer'];
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
