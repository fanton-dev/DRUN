import {HttpRequest} from '../../../../core/@types/global';

/**
 * Express controller for handling of POST "users/authenticate/send-sms-token".
 *
 * @export
 * @param {{sendAuthenticationSmsCode: Function}} {
 *   sendAuthenticationSmsCode
 * } - dependency injection
 * @return {Function} - post users send sms token controller builder function
 */
export default function buildPostAuthenticateSendSms({
  sendAuthenticationSmsCode,
}: {sendAuthenticationSmsCode: Function}): Function {
  return async function postAuthenticateSendSms(httpRequest: HttpRequest) {
    try {
      const phoneNumber = httpRequest.body['phoneNumber'];
      const verificationInstance = await sendAuthenticationSmsCode(
          phoneNumber,
      );
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 201,
        body: {verificationInstance},
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
