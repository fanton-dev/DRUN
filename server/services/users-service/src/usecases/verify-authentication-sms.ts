import config from 'config';
import {Repository} from 'typeorm';
import {SMSApi} from '../../core/@types/sms-api';
import {SharedQueue} from '../../core/@types/shared-queue';
import User from '../database/entities/user';


/**
 * Verifies a authentication SMS code and stores new users into the database.
 *
 * @export
 * @param {{
 *   smsApi: SMSApi,
 *   sharedQueue: SharedQueue,
 *   getUsersRepository: Function,
 *   generateToken: Function,
 * }} {
 *   smsApi,
 *   sharedQueue,
 *   getUsersRepository,
 *   generateToken
 * } - dependency injection
 * @return {Function} - verify authentication sms usecase
 */
export default function buildVerifyAuthenticationSms({
  smsApi,
  sharedQueue,
  getUsersRepository,
  generateToken,
}: {
  smsApi: SMSApi;
  sharedQueue: SharedQueue;
  getUsersRepository(): Repository<User>;
  generateToken: () => string;
}): Function {
  return async function verifyAuthenticationSms(
      phoneNumber: string,
      code: string,
  ) {
    // Emitting an 'USER_INVALID_NUMBER' event in shared queue on invalid code
    try {
      // Verifying the code received
      await smsApi.verifyCode(phoneNumber, code);
    } catch (e) {
      sharedQueue.emit([
        config.get('INBOUND_LOGGER_SERVICE_QUEUE'),
      ], {
        subject: 'USER_INVALID_CODE',
        body: {phoneNumber: phoneNumber, error: 'Invalid verification code.'},
      });
      throw new Error('Invalid verification code.');
    }

    let isNew = false;
    let user = await getUsersRepository().findOne({phoneNumber: phoneNumber});
    if (!user) {
      // Storing new user into the database.
      user = new User({
        token: generateToken(),
        phoneNumber: phoneNumber,
      });
      user = await getUsersRepository().save(user);
      isNew = true;

      // Notifying logger for a registered user
      sharedQueue.emit([
        config.get('INBOUND_LOGGER_SERVICE_QUEUE'),
      ], {
        subject: 'USER_REGISTERED',
        body: {phoneNumber: phoneNumber},
      });
    }

    // Emitting an 'USER_LOGGED_IN' event in shared queue on valid code
    sharedQueue.emit([
      config.get('INBOUND_LOGGER_SERVICE_QUEUE'),
    ], {
      subject: 'USER_LOGGED_IN',
      body: {phoneNumber: phoneNumber},
    });

    return {'isNew': isNew, 'userId': user.id, 'userToken': user.token};
  };
}
