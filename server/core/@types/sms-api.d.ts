import {
  VerificationInstance,
} from 'twilio/lib/rest/verify/v2/service/verification';
import {
  VerificationCheckInstance,
} from 'twilio/lib/rest/verify/v2/service/verificationCheck';

/**
 * SMS API object structure.
 *
 * @export
 * @interface SMSApi
 */
export interface SMSApi {
    sendCode(
      phoneNumber: string,
      channel: 'sms' | 'call',
  ): Promise<VerificationInstance>;

    verifyCode(
      phoneNumber: string,
      code: string,
    ): Promise<VerificationCheckInstance>;
}
