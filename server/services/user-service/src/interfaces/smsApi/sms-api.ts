import {SMSApi, SMSClient} from '../../../../core/@types/global';

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
}: {
  smsClient: SMSClient,
}): SMSApi {
  /**
   * Sends a SMS with an authentication token to a given number.
   *
   * @param {string} phoneNumber - number to send an SMS to
   * @param {Function} callback - callback for obtaining the sent SMS id
   */
  function sendToken(
      phoneNumber: string,
      callback: (smsId: string) => any,
  ): void {
    smsClient.verify.create(phoneNumber, {
      template: '[DRUN] %token is your authentication code.',
    }, (e, res) => {
      if (e) throw e;
      callback(String(res?.id));
    });
  }

  /**
   * Verifies a SMS token.
   *
   * @param {string} smsId - sent SMS id
   * @param {string} token - token input from client
   * @param {Function} callback - callback for obtaining the phone number
   */
  function verifyToken(
      smsId: string,
      token: string,
      callback: (phoneNumber: string) => any,
  ): void {
    smsClient.verify.verify(smsId, token, (e, res) => {
      if (e) throw e;
      callback(String(res?.recipient.toString()));
    });
  }

  return Object.freeze({
    sendToken: sendToken,
    verifyToken: verifyToken,
  });
}
