import {
  QueueLibrary,
  QueueMessage,
  QueueMessageRaw,
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
   * @param {QueueMessage} message
   * @return {Promise<void>}
   */
  async function emit <T extends Object>(
      queueNames: Array<string>,
      message: QueueMessage<T>,
  ): Promise<void> {
    queueNames.forEach(async (queueName) => {
      const connection = await queueLibrary.connect(queueUrl);
      const channel = await connection.createChannel();
      await channel.assertQueue(queueName, {durable: true});
      channel.sendToQueue(
          queueName,
          Buffer.from(JSON.stringify(message)),
          {persistent: true},
      );
      setTimeout(async () => await connection.close(), 500);
    });
  }

  /**
   * Listens for messages from a shared queue.
   *
   * @param {string} queueName
   * @param {Function} callback
   * @return {Promise<void>}
   */
  async function listen(
      queueName: string,
      callback: (message: QueueMessage<any>) => any,
  ): Promise<void> {
    const connection = await queueLibrary.connect(queueUrl);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, {durable: true});
    await channel.prefetch(1);
    await channel.consume(
        queueName,
        async (msg: QueueMessageRaw | null) => {
          await callback(JSON.parse(String(msg?.content.toString())));
          if (!msg) {
            throw new Error('Null message');
          }
          channel.ack(msg);
        },
        {noAck: false},
    );
  }

  return Object.freeze({
    emit: emit,
    listen: listen,
  });
}
