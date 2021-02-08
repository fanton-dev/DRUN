import config from '../../../../core/config';
import messagebird from 'messagebird';
import buildSmsApi from './sms-api';

const messagebirdClient = messagebird(config.messagebirdSecretKey);

const smsApi = buildSmsApi({smsClient: messagebirdClient});

export default smsApi;
