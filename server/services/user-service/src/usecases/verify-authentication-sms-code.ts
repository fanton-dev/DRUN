import {
  SharedQueue,
  SMSApi,
  SMSVerificationCheckInstance,
} from '../../../core/@types/global';
import config from '../../../core/config';


/**
 * Verifies a authentication SMS code.
 *
 * @export
 * @param {{
 *   smsApi: SMSApi,
 *   sharedQueue: SharedQueue,
 * }} {
 *   smsApi,
 *   sharedQueue,
 * } - dependency injection
 * @return {Function}
 */
export default function buildVerifyAuthenticationSmsCode({
  smsApi,
  sharedQueue,
}: {
  smsApi: SMSApi;
  sharedQueue: SharedQueue;
}): Function {
  return async function verifyAuthenticationSmsCode(
      phoneNumber: string,
      code: string,
  ) {
    // Internal parameter
    let verificationInstance: SMSVerificationCheckInstance;

    // Emitting an 'USER_INVALID_NUMBER' event in shared queue on invalid code
    try {
      // Verifying the code received
      verificationInstance = await smsApi.verifyCode(
          phoneNumber,
          code,
      );
    } catch (e) {
      sharedQueue.emit([
        config.inboundLoggerServiceQueue,
      ], {
        subject: 'USER_INVALID_CODE',
        body: {phoneNumber: phoneNumber, error: e.message},
      });
      return;
    }

    // Emitting an 'USER_LOGGED_IN' event in shared queue on valid code
    sharedQueue.emit([
      config.inboundDeliveryServiceQueue,
      config.inboundLoggerServiceQueue,
    ], {
      subject: 'USER_LOGGED_IN',
      body: {phoneNumber: phoneNumber},
    });

    return verificationInstance;
  };
}
