import faker from 'faker';
import {Order} from '../../../core/global';

/**
 * Provides a builder for fake testing order entities.
 *
 * @export
 * @param {object} [overrides] - data override for fake order
 * @return {Order} - fake order object
 */
export default function makeFakeOrder(overrides?: object): Order {
  const order = {
    sender: {
      id: 'f0a1889b-da86-4365-9007-08b86c50fc9a',
      location: {
        latitude: 43.33,
        longitude: 22.22,
      },
    },
    receiver: {
      id: 'f61574cf-1a2c-430d-9b8c-d7ce93e52760',
      location: {
        latitude: 43.40,
        longitude: 22.32,
      },
    },
    paymentCard: {
      number: '4242 4242 4242 4242',
      date: '12/68',
      CVC: '420',
    },
    source: {
      ip: faker.internet.ip(),
      browser: faker.internet.userAgent(),
      referrer: faker.internet.url(),
    },
  };

  return {
    ...order,
    ...overrides,
  };
}
