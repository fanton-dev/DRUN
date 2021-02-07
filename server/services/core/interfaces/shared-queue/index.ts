import amqp from 'amqplib';
import config from '../../config';
import makeSharedQueue from './shared-queue';

const sharedQueue = makeSharedQueue({
  queueLibrary: amqp,
  queueUrl: config.rabbitMqUrl,
});

export default sharedQueue;
