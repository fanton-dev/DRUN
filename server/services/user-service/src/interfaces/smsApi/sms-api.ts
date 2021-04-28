import {
  SMSApi,
  SMSClient,
  SMSVerificationCheckInstance,
  SMSVerificationInstance,
} from '../../../../core/@types/global';

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
  smsClient: SMSClient,
  serviceId: string,
}): SMSApi {
  /**
   * Sends a SMS with an authentication token to a given number.
   *
   * @param {string} phoneNumber - number to send verification to
   * @param {('sms' | 'call')} channel - whether to voice call or send a SMS
   * @return {Promise<SMSVerificationInstance>}
   */
  async function sendCode(
      phoneNumber: string,
      channel: 'sms' | 'call',
  ): Promise<SMSVerificationInstance> {
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
   * @return {Promise<SMSVerificationCheckInstance>} - API response
   */
  async function verifyCode(
      phoneNumber: string,
      code: string,
  ): Promise<SMSVerificationCheckInstance> {
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
