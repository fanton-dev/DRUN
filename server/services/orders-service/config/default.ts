import dotenv from 'dotenv';

dotenv.config({path: '../../.env'});

export const POSTGRES_HOST_USERS_SERVICE =
    process.env.POSTGRES_HOST_USERS_SERVICE;
export const POSTGRES_USER = process.env.POSTGRES_USER;
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
export const POSTGRES_DB = process.env.POSTGRES_DB;
export const RABBITMQ_URL = process.env.RABBITMQ_URL;

export const API_ROOT = process.env.API_ROOT;

export const INBOUND_PAYMENT_SERVICE_QUEUE =
    process.env.INBOUND_PAYMENT_SERVICE_QUEUE;
export const INBOUND_DELIVERY_SERVICE_QUEUE =
    process.env.INBOUND_DELIVERY_SERVICE_QUEUE;
export const INBOUND_LOGGER_SERVICE_QUEUE =
    process.env.INBOUND_LOGGER_SERVICE_QUEUE;
