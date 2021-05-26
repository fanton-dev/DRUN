import dotenv from 'dotenv';

dotenv.config({path: '../../.env'});

export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
export const TWILIO_SERVICE_ID = process.env.TWILIO_SERVICE_ID;

export const POSTGRES_HOST = process.env.POSTGRES_HOST;
export const POSTGRES_USER = process.env.POSTGRES_USER;
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
export const POSTGRES_DB_USERS_SERVICE = process.env.POSTGRES_DB_USERS_SERVICE;
export const RABBITMQ_URL = process.env.RABBITMQ_URL;

export const API_ROOT = process.env.API_ROOT;

export const INBOUND_PAYMENT_SERVICE_QUEUE =
    process.env.INBOUND_PAYMENT_SERVICE_QUEUE;
export const INBOUND_ORDER_SERVICE_QUEUE =
    process.env.INBOUND_ORDER_SERVICE_QUEUE;
export const INBOUND_LOGGER_SERVICE_QUEUE =
    process.env.INBOUND_LOGGER_SERVICE_QUEUE;

