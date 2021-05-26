import dotenv from 'dotenv';

dotenv.config({path: '../../.env'});

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export const RABBITMQ_URL = process.env.RABBITMQ_URL;

export const INBOUND_PAYMENT_SERVICE_QUEUE =
    process.env.INBOUND_PAYMENT_SERVICE_QUEUE;

export const INBOUND_LOGGER_SERVICE_QUEUE =
    process.env.INBOUND_LOGGER_SERVICE_QUEUE;
