import {ControllerRequest} from '../../core/@types/controllers';

/**
 * Express controller for handling of POST "users/authenticate/verify-sms-code"
 *
 * @export
 * @param {{verifyAuthenticationSms: Function}} {
 *   verifyAuthenticationSms
 * } - dependency injection
 * @return {Function} - post users send sms code controller builder function
 */
export default function buildPostAuthenticateVerifyCode({
  verifyAuthenticationSms,
}: {verifyAuthenticationSms: Function}): Function {
  return async function postAuthenticateVerifyCode(
      controllerRequest: ControllerRequest,
  ) {
    try {
      const verificationInfo = controllerRequest.body;
      const {isNew, ...verificationStatus} = await verifyAuthenticationSms(
          verificationInfo.phoneNumber,
          verificationInfo.code,
      );
      return {
        headers: {'Content-Type': 'application/json'},
        statusCode: isNew ? 201 : 200,
        body: verificationStatus,
      };
    } catch (e) {
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: {error: e.message},
      };
    }
  };
}
