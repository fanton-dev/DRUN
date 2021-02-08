import notFound from '../../../../core/interfaces/controllers/not-found';
import buildPostAuthenticateSendSms from './post-authenticate-send-sms-token';
import buildPostAuthenticateVerifyToken
  from './post-authenticate-verify-sms-token';
import {
  sendAuthenticationSmsCode,
  verifyAuthenticationSmsCode,
} from '../../usecases';

const postAuthenticateSendSms = buildPostAuthenticateSendSms({
  sendAuthenticationSmsCode,
});

const postAuthenticateVerifyToken = buildPostAuthenticateVerifyToken({
  verifyAuthenticationSmsCode,
});

const orderController = Object.freeze({
  postAuthenticateSendSms,
  postAuthenticateVerifyToken,
  notFound,
});

export default orderController;
export {
  postAuthenticateSendSms,
  postAuthenticateVerifyToken,
  notFound,
};
