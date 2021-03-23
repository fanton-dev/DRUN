import {Twilio} from 'twilio';
import {
  VerificationInstance,
} from 'twilio/lib/rest/verify/v2/service/verification';
import {
  VerificationCheckInstance,
} from 'twilio/lib/rest/verify/v2/service/verificationCheck';
import {SMSApi} from '../../core/@types/apis';

/**
 * SMS API interactions interface.
 *
 * @export
 * @param {{
 *   smsClient: SMSClient,
 * }} {
 *   smsClient,
 * } - dependency injection
 * @return {SMSApi}
 */
export default function buildSmsApi({
  smsClient,
  serviceId,
}: {
  smsClient: Twilio,
  serviceId: string,
}): SMSApi {
  /**
   * Sends a SMS with an authentication code to a given number.
   *
   * @param {string} phoneNumber - number to send verification to
   * @param {('sms' | 'call')} channel - whether to voice call or send a SMS
   * @return {Promise<VerificationInstance>}
   */
  async function sendCode(
      phoneNumber: string,
      channel: 'sms' | 'call',
  ): Promise<VerificationInstance> {
    return await new Promise((resolve, reject) => {
      smsClient.verify
          .services(serviceId)
          .verifications
          .create({
            to: phoneNumber,
            channel: channel,
          })
          .then((response) => resolve(response))
          .catch((response) => reject(response));
    });
  }

  /**
   * Verifies a SMS code.
   *
   * @param {string} phoneNumber - number to send verification to
   * @param {string} code - verification code received on the phone
   * @return {Promise<VerificationCheckInstance>} - API response
   */
  async function verifyCode(
      phoneNumber: string,
      code: string,
  ): Promise<VerificationCheckInstance> {
    return await new Promise((resolve, reject) => {
      smsClient.verify
          .services(serviceId)
          .verificationChecks
          .create({
            to: phoneNumber,
            code: code,
          })
          .then((response) => resolve(response))
          .catch((response) => reject(response));
    });
  }

  return Object.freeze({
    sendCode: sendCode,
    verifyCode: verifyCode,
  });
}
