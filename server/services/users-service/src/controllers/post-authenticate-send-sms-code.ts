import {ControllerRequest} from '@core/@types/controllers';

/**
 * Express controller for handling of POST "users/authenticate/send-sms-token".
 *
 * @export
 * @param {{sendAuthenticationSms: Function}} {
 *   sendAuthenticationSms
 * } - dependency injection
 * @return {Function} - post users send sms token controller builder function
 */
export default function buildPostAuthenticateSendSmsCode({
  sendAuthenticationSms: sendAuthenticationSms,
}: {sendAuthenticationSms: Function}): Function {
  return async function postAuthenticateSendSms(
      controllerRequest: ControllerRequest,
  ) {
    console.log(controllerRequest.body);
    try {
      const authenticationSmsStatus = await sendAuthenticationSms(
          controllerRequest.body['phoneNumber'],
      );
      return {
        headers: {'Content-Type': 'application/json'},
        statusCode: 200,
        body: authenticationSmsStatus,
      };
    } catch (e) {
      return {
        headers: {'Content-Type': 'application/json'},
        statusCode: 400,
        body: {error: e.message},
      };
    }
  };
}
