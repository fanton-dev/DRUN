import {
  QueueChannel,
  QueueConnection,
  QueueLibrary,
  SharedQueue,
} from '../../@types/global';

/**
 * Provides methods for interacting with the shared services queue.
 *
 * @export
 * @param {{queueLibrary: QueueLibrary, queueUrl: string}} {
 *   queueLibrary,
 *   queueUrl,
 * }
 * @return {SharedQueue}
 */
export default function makeSharedQueue({
  queueLibrary,
  queueUrl,
}: {queueLibrary: QueueLibrary, queueUrl: string}): SharedQueue {
  /**
   * Emits a message to a shared queue.
   *
   * @param {string} queueName
   * @param {object} message
   */
  async function emit(queueName: string, message: object) {
    queueLibrary.connect(queueUrl, (e0: Error, connection: QueueConnection) => {
      if (e0) {
        throw e0;
      }
      connection.createChannel((e1: Error, channel: QueueChannel) => {
        if (e1) {
          throw e1;
        }
        channel.assertQueue(queueName, {durable: false});
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
      });
    });
  }

  /**
   * Consumes a message from a shared queue.
   *
   * @param {string} queueName
   */
  async function consume(queueName: string) {
    queueLibrary.connect(queueUrl, (e0: Error, connection: QueueConnection) => {
      if (e0) {
        throw e0;
      }
      connection.createChannel((e1:Error, channel: QueueChannel) => {
        if (e1) {
          throw e1;
        }
        channel.consume(queueName, (message: {content: object}) => {
          return JSON.stringify(message.content.toString());
        }, {
          noAck: true,
        });
      });
    });
  }

  return Object.freeze({
    emit: emit,
    consume: consume,
  });
}
