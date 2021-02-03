/**
 * Express controller for non-existent endpoints.
 *
 * @export
 * @return {Promise<object>} - 404 not found response
 */
export default async function notFound(): Promise<object> {
  return {
    headers: {
      'Content-Type': 'application/json',
    },
    body: {error: 'Not found.'},
    statusCode: 404,
  };
}
