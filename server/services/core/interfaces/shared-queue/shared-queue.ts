import {
  QueueChannel,
  QueueConnection,
  QueueLibrary,
  QueueMessage,
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
   * Emits a message to a list of shared queues.
   *
   * @param {Array<string>} queueNames
   * @param {object} message
   */
  function emit(queueNames: Array<string>, message: object): void {
    queueLibrary.connect(queueUrl, (e0: Error, connection: QueueConnection) => {
      queueNames.map((queueName) => {
        if (e0) {
          throw e0;
        }

        connection.createChannel((
            e1: Error,
            channel: QueueChannel,
        ) => {
          if (e1) {
            throw e1;
          }

          channel.assertQueue(queueName, {durable: true});
          channel.sendToQueue(
              queueName,
              Buffer.from(JSON.stringify(message)),
              {persistent: true},
          );
        });
      });

      setTimeout(function() {
        connection.close();
      }, 500);
    });
  }

  /**
   * Listens for messages from a shared queue.
   *
   * @param {string} queueName
   * @param {Function} callback
   */
  function listen(
      queueName: string,
      callback: (message: string) => any,
  ): void {
    queueLibrary.connect(queueUrl, (e0: Error, connection: QueueConnection) => {
      if (e0) {
        throw e0;
      }
      connection.createChannel((e1:Error, channel: QueueChannel) => {
        if (e1) {
          throw e1;
        }

        channel.assertQueue(queueName, {durable: true});
        channel.prefetch(1);
        channel.consume(
            queueName,
            (msg: QueueMessage | null) => {
              callback(JSON.stringify(msg?.content.toString()));
            },
            {noAck: false},
        );
      });
    });
  }

  return Object.freeze({
    emit: emit,
    listen: listen,
  });
}
