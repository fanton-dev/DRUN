import dotenv from 'dotenv';

dotenv.config({path: '../../.env'});

export const RABBITMQ_URL = process.env.RABBITMQ_URL;

export const API_ROOT = process.env.API_ROOT;

export const INBOUND_LOGGER_SERVICE_QUEUE =
    process.env.INBOUND_LOGGER_SERVICE_QUEUE;
