import {ControllerResponse} from '@core/@types/controllers';

/**
 * Express controller for non-existent endpoints.
 *
 * @export
 * @return {Promise<ControllerResponse>} - 404 not found response
 */
export default async function notFound(): Promise<ControllerResponse> {
  return {
    headers: {
      'Content-Type': 'application/json',
    },
    body: {error: 'Not found.'},
    statusCode: 404,
  };
}
