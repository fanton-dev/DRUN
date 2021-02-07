import {HttpRequest} from '../../../../core/@types/global';

/**
 * Express controller for handling of DELETE "/drones".
 *
 * @export
 * @param {Function} disconnectDrone - drone disconnect dependency injection
 * @return {Function} - delete drone controller builder function
 */
export default function makeDeleteDrone({
  disconnectDrone,
}: {disconnectDrone: Function}): Function {
  return async function deleteDrone(httpRequest: HttpRequest) {
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      const deleteDrone = await disconnectDrone(
          httpRequest.ip,
      );
      return {
        headers,
        statusCode: 200,
        body: deleteDrone,
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
