import {
  SharedQueue,
  SMSApi,
  SMSVerificationCheckInstance,
  User,
  UserDatabaseController,
  UserExport,
} from '../../../core/@types/global';
import config from '../../../core/config';
import makeUser from '../entities/user';


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
  usersDatabase,
  exportToNormalEntity,
}: {
  smsApi: SMSApi;
  sharedQueue: SharedQueue;
  usersDatabase: UserDatabaseController;
  exportToNormalEntity<T extends Object, U extends Object>(object: T): U;
}): Function {
  return async function verifyAuthenticationSmsCode(
      phoneNumber: string,
      code: string,
  ) {
    // Internal parameter
    let verificationInstance: SMSVerificationCheckInstance;
    let user: UserExport;
    let normalizedUser: User;

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
        body: {phoneNumber: phoneNumber, error: 'Invalid verification code.'},
      });
      return {error: 'Invalid verification code.'};
    }

    // If user is not found in the database we create a new user and store it
    return usersDatabase.findByPhoneNumber(
        verificationInstance.to,
    ).catch((_) => {
      // Creating user object
      user = makeUser({
        phoneNumber: verificationInstance.to,
      });
      normalizedUser = exportToNormalEntity(user);

      // Inserts into database
      usersDatabase.insert(normalizedUser).catch((e) => {
        throw e;
      });

      // Notifying logger for a registered user
      sharedQueue.emit([
        config.inboundLoggerServiceQueue,
      ], {
        subject: 'USER_REGISTERED',
        body: {phoneNumber: phoneNumber},
      });
      return normalizedUser;
    }).then((user) => {
      // Emitting an 'USER_LOGGED_IN' event in shared queue on valid code
      sharedQueue.emit([
        config.inboundDeliveryServiceQueue,
        config.inboundLoggerServiceQueue,
      ], {
        subject: 'USER_LOGGED_IN',
        body: {phoneNumber: phoneNumber},
      });

      return {'userId': user.id, 'userToken': user.token};
    });
  };
}
