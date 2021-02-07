import {v4 as uuidv4} from 'uuid';
import makeFakeDrone from './drone';
import makeDrone from '../../src/entities/drone';
import {Delivery} from '../../../core/@types/global';

/**
 * Provides a builder for fake testing delivery entities.
 *
 * @export
 * @param {object} [overrides] - data override for fake delivery
 * @return {Delivery} - fake delivery object
 */
export default function makeFakeDelivery(overrides?: object): Delivery {
  const delivery = {
    orderId: uuidv4(),
    drone: makeDrone(makeFakeDrone()),
    senderLocation: {
      latitude: 42.666705,
      longitude: 23.374919,
    },
    receiverLocation: {
      latitude: 42.652900,
      longitude: 23.354952,
    },
  };

  return {
    ...delivery,
    ...overrides,
  };
}
