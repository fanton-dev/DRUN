import smsApi from '../interfaces/smsApi';
import sharedQueue from '../../../core/interfaces/shared-queue';
import usersDatabase from '../interfaces/users-database';
import {exportToNormalEntity} from '../../../core/entities/utilities';
import buildSendAuthenticationSmsCode from './send-authentication-sms-code';
import buildVerifyAuthenticationSmsCode from './verify-authentication-sms-code';

const sendAuthenticationSmsCode = buildSendAuthenticationSmsCode({
  smsApi,
  sharedQueue,
});

const verifyAuthenticationSmsCode = buildVerifyAuthenticationSmsCode({
  smsApi,
  sharedQueue,
  usersDatabase,
  exportToNormalEntity,
});

const ordersService = Object.freeze({
  sendAuthenticationSmsCode,
  verifyAuthenticationSmsCode,
});

export default ordersService;
export {sendAuthenticationSmsCode, verifyAuthenticationSmsCode};
