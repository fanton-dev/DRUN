import dotenv from 'dotenv';

dotenv.config();

const config = Object.freeze({
  rabbitMqUrl: String(process.env.RABBITMQ_URL),
  postgresUrl: String(process.env.POSTGRES_URL),
  postgresPort: parseInt(String(process.env.POSTGRES_PORT)),

  postgresUser: String(process.env.POSTGRES_USER),
  postgresPassword: String(process.env.POSTGRES_PASSWORD),

  postgresDb: String(process.env.POSTGRES_DB),
  postgresDbOrdersTable: String(process.env.POSTGRES_DB_ORDERS_TABLE),
  postgresDbPaymentTable: String(process.env.POSTGRES_DB_PAYMENTS_TABLE),
  postgresDbDeliveriesTable: String(process.env.POSTGRES_DB_DELIVERIES_TABLE),
  postgresDbUsersTable: String(process.env.POSTGRES_DB_USERS_TABLE),

  apiRoot: String(process.env.API_ROOT),

  rabbitReconnectInterval: String(process.env.RABBIT_RECONNECT_INTERVAL),
  inboundPaymentServiceQueue: String(process.env.INBOUND_PAYMENT_SERVICE_QUEUE),
  inboundDeliveryServiceQueue: String(
      process.env.INBOUND_DELIVERY_SERVICE_QUEUE,
  ),
  inboundLoggerServiceQueue: String(process.env.INBOUND_LOGGER_SERVICE_QUEUE),
  inboundUserServiceQueue: String(process.env.INBOUND_USER_SERVICE_QUEUE),
});

export default config;
