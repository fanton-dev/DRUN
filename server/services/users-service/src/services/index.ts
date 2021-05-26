import sharedQueue from '@core/shared-queue';
import database from '@src/database';
import buildVerifyAuthenticationSms
  from '@src/services//verify-authentication-sms';
import buildSendAuthenticationSms
  from '@src/services/send-authentication-sms';
import buildVerifyUserToken from '@src/services/verify-user-token';
import smsApi from '@src/sms-api';
import crypto from 'crypto';

const sendAuthenticationSms = buildSendAuthenticationSms({
  smsApi,
  sharedQueue,
});

const verifyAuthenticationSms = buildVerifyAuthenticationSms({
  smsApi,
  sharedQueue,
  database,
  generateToken: () => crypto.randomBytes(32).toString('hex'),
});

const isUserIdToTokenValid = buildVerifyUserToken({
  database,
});

const services = Object.freeze({
  sendAuthenticationSms,
  verifyAuthenticationSms,
  isUserIdToTokenValid,
});

export default services;
export {
  sendAuthenticationSms,
  verifyAuthenticationSms,
  isUserIdToTokenValid,
};
