import {Connection} from 'amqplib';
import {Options} from 'amqplib/properties';
import * as Bluebird from 'bluebird';

/**
 * Queue Library object structure.
 *
 * @exports
 * @interface QueueLibrary
 */
export interface QueueLibrary {
  connect(
    url: string | Options.Connect,
    socketOptions?: any
  ): Bluebird<Connection>;
}

/**
 * Queue message object structure.
 *
 * @export
 * @interface QueueMessage
 * @template T
 */
export interface QueueMessage<T extends Object> {
  subject: string;
  body: T;
}

/**
 * Shared Queue object structure.
 *
 * @exports
 * @interface SharedQueue
 */
export interface SharedQueue {
  emit <T extends Object>(
    queueNames: Array<string>,
    message: QueueMessage<T>
  ): Promise<void>;

  listen(
    queueName: string,
    callback: (message: QueueMessage<any>) => any,
  ): Promise<void>;
}
