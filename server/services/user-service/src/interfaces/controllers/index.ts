import notFound from '../../../../core/interfaces/controllers/not-found';
import buildPostAuthenticateSendSms from './post-authenticate-send-sms-token';
import buildPostAuthenticateVerifyCode
  from './post-authenticate-verify-sms-token';
import {
  sendAuthenticationSmsCode,
  verifyAuthenticationSmsCode,
} from '../../usecases';

const postAuthenticateSendSms = buildPostAuthenticateSendSms({
  sendAuthenticationSmsCode,
});

const postAuthenticateVerifyCode = buildPostAuthenticateVerifyCode({
  verifyAuthenticationSmsCode,
});

const orderController = Object.freeze({
  postAuthenticateSendSms,
  postAuthenticateVerifyCode,
  notFound,
});

export default orderController;
export {
  postAuthenticateSendSms,
  postAuthenticateVerifyCode,
  notFound,
};
