import {UserExport} from '@core/@types/entity-exports';
import {SharedQueue} from '@core/@types/shared-queue';
import {SMSApi} from '@core/@types/sms-api';
import config from 'config';
import {Knex} from 'knex';
import makeUser from '../user';

/**
 * Verifies a authentication SMS code and stores new users into the database.
 *
 * @export
 * @param {{
 *   smsApi: SMSApi,
 *   sharedQueue: SharedQueue,
 *   getUsersRepository: Function,
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
  database,
}: {
  smsApi: SMSApi;
  sharedQueue: SharedQueue;
  database: Knex;
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

    const isNew = false;
    let userModel: UserExport;
    let user = await database('users').where({phone_number: phoneNumber});

    console.log(user);
    if (user.length === 0) {
      // Storing new user into the database.
      userModel = makeUser({
        phoneNumber,
      });

      user = await database('users').insert({
        id: userModel.getId(),
        phone_number: userModel.getPhoneNumber(),
        token: userModel.getToken(),
      });

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

    return {
      'isNew': isNew,
      'userId': userModel.getId(),
      'userToken': userModel.getToken(),
    };
  };
}
