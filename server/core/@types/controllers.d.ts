/**
 * Controller Request object structure.
 *
 * @exports
 * @interface ControllerRequest
 */
export interface ControllerRequest {
  headers: any;
  body: any;
  params?: any;
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
