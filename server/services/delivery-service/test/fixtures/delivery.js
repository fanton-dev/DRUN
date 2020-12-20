import {v4 as uuidv4} from 'uuid';
import makeFakeDrone from './drone';
import makeDrone from '../../src/entities/drone';

/**
 * Provides a fake delivery entity for testing.
 *
 * @export
 * @param {*} overrides
 * @return {*}
 */
export default function makeFakeDelivery(overrides) {
  const delivery = {
    orderId: uuidv4,
    drone: makeDrone(makeFakeDrone()),
    senderLocation: {
      latitude: '42.666705',
      longitude: '23.374919',
    },
    receiverLocation: {
      latitude: '42.652900',
      longitude: '23.354952',
    },
  };

  return {
    ...delivery,
    ...overrides,
  };
}
