const config = Object.freeze({
  rabbitMqUrl: process.env.RABBITMQ_URL,
  postgresUrl: process.env.POSTGRES_URL,

  postgresDb: process.env.POSTGRES_DB,
  postgresDbOrdersTable: process.env.POSTGRES_DB_ORDERS_TABLE,
  postgresDbPaymentTable: process.env.POSTGRES_DB_PAYMENTS_TABLE,
  postgresDbDeliveriesTable: process.env.POSTGRES_DB_DELIVERIES_TABLE,
  postgresDbDeliveriesTable: process.env.POSTGRES_DB_USERS_TABLE,

  apiRoot: process.env.API_ROOT,

  rabbitReconnectInterval: process.env.RABBIT_RECONNECT_INTERVAL,
  inboundPaymentServiceQueue: process.env.INBOUND_PAYMENT_SERVICE_QUEUE,
  inboundDeliveryServiceQueue: process.env.INBOUND_DELIVERY_SERVICE_QUEUE,
  inboundUserServiceQueue: process.env.INBOUND_USER_SERVICE_QUEUE,
});

export default config;
