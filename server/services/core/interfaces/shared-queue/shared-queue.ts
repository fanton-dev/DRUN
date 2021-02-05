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
    const connection = await queueLibrary.connect(queueUrl);
    const channel = await connection.createChannel();
    Promise.all(queueNames.map(async (queueName) => {
      await channel.assertQueue(queueName, {durable: true});
      await channel.sendToQueue(
          queueName,
          Buffer.from(JSON.stringify(message)),
          {persistent: true},
      );
    })).then(async () => await connection.close());
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
        (msg: QueueMessageRaw | null) => {
          callback(JSON.parse(String(msg?.content.toString())));
        },
        {noAck: false},
    );
  }

  return Object.freeze({
    emit: emit,
    listen: listen,
  });
}
