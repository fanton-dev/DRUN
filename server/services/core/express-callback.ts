import {Request, RequestHandler, Response} from 'express';
import {HttpResponse} from './@types/global';

/**
 * Creates an express callback from a given controller.
 *
 * @export
 * @param {Function} controller - express controller function
 * @return {RequestHandler} - express response handler
 */
export default function makeExpressCallback(
    controller: Function,
): RequestHandler {
  return (req: Request, res: Response) => {
    const httpRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      ip: req.ip,
      method: req.method,
      path: req.path,
      headers: {
        'Content-Type': req.get('Content-Type'),
        'Referer': req.get('referer'),
        'User-Agent': req.get('User-Agent'),
      },
    };
    controller(httpRequest)
        .then((httpResponse: HttpResponse) => {
          if (httpResponse.headers) {
            res.set(httpResponse.headers);
          }
          res.type('json');

          res.status(httpResponse.statusCode).send(httpResponse.body);
        })
        .catch((err: Error) => res.status(500).send({
          error: `An unhandled error occurred: ${err}.`,
        }));
  };
};
