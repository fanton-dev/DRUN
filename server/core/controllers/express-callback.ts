import {ControllerResponse} from '@core/@types/controllers';
import {Request, RequestHandler, Response} from 'express';

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
        .then((controllerResponse: ControllerResponse) => {
          if (controllerResponse.headers) {
            res.set(controllerResponse.headers);
          }

          res.type('json');

          res.status(
              controllerResponse.statusCode,
          ).send(controllerResponse.body);
        })
        .catch((err: Error) => res.status(500).send({
          error: `An unhandled error occurred: ${err}.`,
        }));
  };
};
