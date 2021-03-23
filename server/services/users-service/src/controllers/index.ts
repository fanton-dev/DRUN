import notFound from '../../core/controllers/not-found';
import buildPostAuthenticateSendSmsCode
  from './post-authenticate-send-sms-code';
import buildPostAuthenticateVerifySmsCode
  from './post-authenticate-verify-sms-code';
import usecases from '../usecases';

const postAuthenticateSendSmsCode = buildPostAuthenticateSendSmsCode({
  sendAuthenticationSms: usecases.sendAuthenticationSms,
});

const postAuthenticateVerifySmsCode = buildPostAuthenticateVerifySmsCode({
  verifyAuthenticationSms: usecases.verifyAuthenticationSms,
});

const userController = Object.freeze({
  postAuthenticateSendSmsCode: postAuthenticateSendSmsCode,
  postAuthenticateVerifySmsCode: postAuthenticateVerifySmsCode,
  notFound,
});

export default userController;
export {
  postAuthenticateSendSmsCode,
  postAuthenticateVerifySmsCode,
  notFound,
};
