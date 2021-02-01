import amqp from 'mock-amqplib';
import config from '../../config';
import {SharedQueue} from '../../@types/global';
import makeSharedQueue from './shared-queue';

describe('shared-queue', () => {
  let sharedQueue: SharedQueue;

  beforeEach(async () => {
    sharedQueue = makeSharedQueue({
      queueLibrary: amqp,
      queueUrl: config.rabbitMqUrlTest,
    });
  });

  it('must emit event on a single queue', async () => {
    const message = {message: 'i do stuff'};
    const queueName = 'test_queue';

    // Asserting whether emitting to a single queue was successful
    expect(async () => {
      await sharedQueue.emit([queueName], message);
    }).not.toThrow();
  });

  it('must get emitted messages when listening', async () => {
    const message = {message: 'i do stuff'};
    const queueName = 'test_queue';

    // Asserting whether emitting to a single queue was successful
    expect(async () => {
      await sharedQueue.emit([queueName], message);
    }).not.toThrow();

    // Defining a callback function and a spy bound to it which will be used to
    // verify the callback was called exactly once (only 1 message in queue)
    let response: object;
    const callbackObject = {
      callback: (result: object) => response = result,
    };
    const spy = jest.spyOn(callbackObject, 'callback');

    // Starting to listen for messages
    await sharedQueue.listen(
        queueName,
        callbackObject.callback,
    );
    expect(response).toEqual(message);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
