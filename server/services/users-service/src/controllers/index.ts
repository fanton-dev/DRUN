import notFound from '@core/controllers/not-found';
import services from '@src/services';
import buildPostAuthenticateSendSmsCode
  from './post-authenticate-send-sms-code';
import buildPostAuthenticateVerifySmsCode
  from './post-authenticate-verify-sms-code';

const postAuthenticateSendSmsCode = buildPostAuthenticateSendSmsCode({
  sendAuthenticationSms: services.sendAuthenticationSms,
});

const postAuthenticateVerifySmsCode = buildPostAuthenticateVerifySmsCode({
  verifyAuthenticationSms: services.verifyAuthenticationSms,
});

const controllers = Object.freeze({
  postAuthenticateSendSmsCode: postAuthenticateSendSmsCode,
  postAuthenticateVerifySmsCode: postAuthenticateVerifySmsCode,
  notFound,
});

export default controllers;
export {
  postAuthenticateSendSmsCode,
  postAuthenticateVerifySmsCode,
  notFound,
};
