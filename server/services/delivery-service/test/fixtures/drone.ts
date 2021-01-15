import faker from 'faker';
import {Drone} from '../../../core/global';

/**
 * Provides a builder for fake testing drone entities.
 *
 * @export
 * @param {object} [overrides] - data override for fake drone
 * @return {Drone} - fake drone object
 */
export default function makeFakeDrone(overrides?: object): Drone {
  const drone = {
    droneSource: {
      ip: faker.internet.ip(),
      browser: faker.internet.userAgent(),
      referrer: faker.internet.url(),
    },
    homeLocation: {
      latitude: 42.666705,
      longitude: 23.374919,
    },
  };

  return {
    ...drone,
    ...overrides,
  };
}
