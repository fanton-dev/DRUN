module.exports = {
  rabbitMqUrl: process.env.RABBITMQ_URL,
  mongoUrl: process.env.MONGO_URL,
  dbName: process.env.DB_NAME,
  apiRoot: process.env.API_ROOT,
  rabbitReconnectInterval: process.env.RABBIT_RECONNECT_INTERVAL,
  ordersQueue: process.env.ORDERS_QUEUE,
  paymentsQueue: process.env.PAYMENTS_QUEUE,
  deliveriesQueue: process.env.DELIVERIES_QUEUE,
};
