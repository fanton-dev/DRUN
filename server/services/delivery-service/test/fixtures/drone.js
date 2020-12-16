import faker from 'faker';

/**
 * Provides a fake drone entity for testing.
 *
 * @export
 * @param {*} overrides
 * @return {*}
 */
export default function makeFakeDrone(overrides) {
  const drone = {
    droneSource: {
      ip: faker.internet.ip(),
      browser: faker.internet.userAgent(),
      referrer: faker.internet.url(),
    },
    homeLocation: {
      latitude: '42.666705',
      longitude: '23.374919',
    },
  };

  return {
    ...drone,
    ...overrides,
  };
}
