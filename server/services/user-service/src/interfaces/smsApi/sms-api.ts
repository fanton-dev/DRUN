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
   * @param {Function} callback - callback containing the verification instance
   * @param {('sms' | 'call')} channel - whether to voice call or send a SMS
   */
  function sendToken(
      phoneNumber: string,
      callback: (verificationInstance: SMSVerificationInstance) => any,
      channel: 'sms' | 'call',
  ): void {
    smsClient.verify
        .services(serviceId)
        .verifications
        .create({
          to: phoneNumber,
          channel: channel,
        })
        .then(callback);
  }

  /**
   * Verifies a SMS code.
   *
   * @param {string} phoneNumber - sent SMS id
   * @param {string} code - code input from client
   * @param {Function} callback - callback for obtaining the phone number
   */
  function verifyCode(
      phoneNumber: string,
      code: string,
      callback: (data: SMSVerificationCheckInstance) => any,
  ): void {
    smsClient.verify
        .services(serviceId)
        .verificationChecks
        .create({
          to: phoneNumber,
          code: code,
        })
        .then((data) => {
          if (data.status !== 'approved') throw new Error('Invalid SMS code.');
          callback(data);
        });
  }

  return Object.freeze({
    sendToken: sendToken,
    verifyCode: verifyCode,
  });
}
