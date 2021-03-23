import {ParamsDictionary} from 'express-serve-static-core';

/**
 * Controller Request object structure.
 *
 * @exports
 * @interface ControllerRequest
 */
export interface ControllerRequest {
  headers: any;
  body: any;
  params?: ParamsDictionary;
  ip?: string;
  method?: string;
  path?: string;
  query?: any;
}

/**
 * Controller Response object structure.
 *
 * @exports
 * @interface ControllerResponse
 */
export interface ControllerResponse {
    headers: any;
    body: any;
    statusCode: number;
}
