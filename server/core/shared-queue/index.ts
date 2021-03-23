import amqplib from 'amqplib';
import config from 'config';
import buildSharedQueue from './shared-queue';

const sharedQueue = buildSharedQueue({
  queueLibrary: amqplib,
  queueUrl: config.get('RABBITMQ_URL'),
});

export default sharedQueue;
