import {
  SharedQueue,
  SMSApi,
  SMSVerificationInstance,
} from '../../../core/@types/global';
import config from '../../../core/config';


/**
 * Sends a authentication SMS code.
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
export default function buildSendAuthenticationSmsCode({
  smsApi,
  sharedQueue,
}: {
  smsApi: SMSApi;
  sharedQueue: SharedQueue;
}): Function {
  return async function sendAuthenticationSmsCode(phoneNumber: string) {
    // Internal parameter
    let verificationInstance: SMSVerificationInstance;

    // Emitting an 'USER_INVALID_NUMBER' event in shared queue on invalid number
    try {
      // Sending verification code
      verificationInstance = await smsApi.sendCode(
          phoneNumber,
          'sms',
      );
    } catch (e) {
      sharedQueue.emit([
        config.inboundLoggerServiceQueue,
      ], {
        subject: 'USER_INVALID_NUMBER',
        body: {phoneNumber: phoneNumber, error: e.message},
      });
      return;
    }

    // Emitting an 'USER_SMS_SEND' event in shared queue on valid number
    sharedQueue.emit([
      config.inboundDeliveryServiceQueue,
      config.inboundLoggerServiceQueue,
    ], {
      subject: 'USER_SMS_SEND',
      body: {phoneNumber: phoneNumber},
    });

    return verificationInstance;
  };
}
