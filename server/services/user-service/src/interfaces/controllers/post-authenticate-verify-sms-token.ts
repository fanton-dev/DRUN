import {HttpRequest} from '../../../../core/@types/global';

/**
 * Express controller for handling of POST "users/authenticate/verify-sms-token"
 *
 * @export
 * @param {{verifyAuthenticationSmsCode: Function}} {
 *   verifyAuthenticationSmsCode
 * } - dependency injection
 * @return {Function} - post users send sms token controller builder function
 */
export default function buildPostAuthenticateVerifyCode({
  verifyAuthenticationSmsCode,
}: {verifyAuthenticationSmsCode: Function}): Function {
  return async function postAuthenticateVerifyCode(httpRequest: HttpRequest) {
    try {
      const verificationInfo = httpRequest.body;
      const verificationInstance = await verifyAuthenticationSmsCode(
          verificationInfo.phoneNumber,
          verificationInfo.code,
      );
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 200,
        body: verificationInstance,
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
