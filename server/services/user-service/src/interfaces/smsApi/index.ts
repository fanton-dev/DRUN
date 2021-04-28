import config from '../../../../core/config';
import twilio from 'twilio';
import buildSmsApi from './sms-api';

const twilioClient = twilio(
    config.twilioAccountSid,
    config.twilioAuthToken,
);

const smsApi = buildSmsApi({
  smsClient: twilioClient,
  serviceId: config.twilioServiceId,
});

export default smsApi;
