import config from 'config';
import twilio from 'twilio';
import buildSmsApi from './sms-api';

const twilioClient = twilio(
    <string> config.get('TWILIO_ACCOUNT_SID'),
    <string> config.get('TWILIO_AUTH_TOKEN'),
);

const smsApi: any = buildSmsApi({
  smsClient: twilioClient,
  serviceId: <string> config.get('TWILIO_SERVICE_ID'),
});

export default smsApi;
