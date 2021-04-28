import dotenv from 'dotenv';

dotenv.config();

const config = Object.freeze({
  postgresUser: String(process.env.POSTGRES_USER),
  postgresPassword: String(process.env.POSTGRES_PASSWORD),
  stripeSecretKey: String(process.env.STRIPE_SECRET_KEY),
  twilioServiceId: String(process.env.TWILIO_SERVICE_ID),
  twilioAccountSid: String(process.env.TWILIO_ACCOUNT_SID),
  twilioAuthToken: String(process.env.TWILIO_AUTH_TOKEN),

  rabbitMqUrl: String(process.env.RABBITMQ_URL),
  rabbitMqUrlTest: String(process.env.RABBITMQ_URL_TEST),
  postgresUrl: String(process.env.POSTGRES_URL),
  postgresPort: parseInt(String(process.env.POSTGRES_PORT)),

  postgresDb: String(process.env.POSTGRES_DB),
  postgresDbOrdersTable: String(process.env.POSTGRES_DB_ORDERS_TABLE),
  postgresDbPaymentTable: String(process.env.POSTGRES_DB_PAYMENTS_TABLE),
  postgresDbDeliveriesTable: String(process.env.POSTGRES_DB_DELIVERIES_TABLE),
  postgresDbUsersTable: String(process.env.POSTGRES_DB_USERS_TABLE),

  apiRoot: String(process.env.API_ROOT),

  rabbitReconnectInterval: String(process.env.RABBIT_RECONNECT_INTERVAL),
  inboundOrderServiceQueue: String(process.env.INBOUND_ORDER_SERVICE_QUEUE),
  inboundPaymentServiceQueue: String(process.env.INBOUND_PAYMENT_SERVICE_QUEUE),
  inboundDeliveryServiceQueue: String(
      process.env.INBOUND_DELIVERY_SERVICE_QUEUE,
  ),
  inboundLoggerServiceQueue: String(process.env.INBOUND_LOGGER_SERVICE_QUEUE),
  inboundUserServiceQueue: String(process.env.INBOUND_USER_SERVICE_QUEUE),
});

export default config;
