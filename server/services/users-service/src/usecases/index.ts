import crypto from 'crypto';
import smsApi from '../sms-api';
import database from '../database';
import sharedQueue from '../../core/shared-queue';
import buildSendAuthenticationSms from './send-authentication-sms';
import buildVerifyAuthenticationSms from './verify-authentication-sms';
import buildVerifyUserToken from './verify-user-token';

const sendAuthenticationSms = buildSendAuthenticationSms({
  smsApi,
  sharedQueue,
});

const verifyAuthenticationSms = buildVerifyAuthenticationSms({
  smsApi,
  sharedQueue,
  getUsersRepository: database.getUsersRepository,
  generateToken: () => crypto.randomBytes(32).toString('hex'),
});

const isUserIdToTokenValid = buildVerifyUserToken({
  getUsersRepository: database.getUsersRepository,
});

const usecases = Object.freeze({
  sendAuthenticationSms,
  verifyAuthenticationSms,
  isUserIdToTokenValid,
});

export default usecases;
export {
  sendAuthenticationSms,
  verifyAuthenticationSms,
  isUserIdToTokenValid,
};
