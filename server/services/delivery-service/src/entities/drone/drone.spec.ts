import faker from 'faker';
import {validate as uuidValidate} from 'uuid';
import makeFakeDrone from '../../../test/fixtures/drone';
import makeDrone from '.';

describe('drone', () => {
  it('must process a proper request', () => {
    const drone = makeFakeDrone();
    expect(() => makeDrone(drone)).not.toThrow();
  });

  it('must have a source', () => {
    const drone = makeFakeDrone({source: null});
    expect(() => makeDrone(drone)).toThrow('Drone must have a source.');
  });

  it('must have a source ip', () => {
    const drone = makeFakeDrone({
      source: {
        ip: null,
        browser: faker.internet.userAgent(),
        referrer: faker.internet.url(),
      },
    });
    expect(() => makeDrone(drone))
        .toThrow('Drone source error: Source must have an IP.');
  });

  it('must have a valid source ip', () => {
    const drone = makeFakeDrone({
      source: {
        ip: '255.255.255.256',
        browser: faker.internet.userAgent(),
        referrer: faker.internet.url(),
      },
    });
    expect(() => makeDrone(drone))
        .toThrow('Drone source error: Source must have a valid IP.');
  });

  it('must have a home location', () => {
    const drone = makeFakeDrone({
      homeLocation: null,
    });
    expect(() => makeDrone(drone))
        .toThrow('Drone home location error: Location not defined.');
  });

  it('must have a home location latitude', () => {
    const drone = makeFakeDrone({
      homeLocation: {
        latitude: null,
        longitude: 22.22,
      },
    });
    expect(() => makeDrone(drone))
        .toThrow('Drone home location error: Location must have a latitude ' +
                 'defined.');
  });

  it('must have a numeric home location latitude', () => {
    const drone = makeFakeDrone({
      homeLocation: {
        latitude: 'gosho',
        longitude: 22.22,
      },
    });
    expect(
        () => makeDrone(drone),
    ).toThrow('Drone home location error: Location latitude must be a ' +
              'number.');
  });

  it('must have a numeric home location longitude', () => {
    const drone = makeFakeDrone({
      homeLocation: {
        latitude: 43.44,
        longitude: 'posho',
      },
    });
    expect(
        () => makeDrone(drone),
    ).toThrow('Drone home location error: Location longitude must be a ' +
              'number.');
  });

  it('must have a home location longitude', () => {
    const drone = makeFakeDrone({
      homeLocation: {
        latitude: 43.44,
        longitude: null,
      },
    });
    expect(() => makeDrone(drone))
        .toThrow('Drone home location error: Location must have a ' +
                 'longitude defined.');
  });

  it('must have a valid home location latitude (above -90)', () => {
    const drone = makeFakeDrone({
      homeLocation: {
        latitude: -90.2,
        longitude: 22.22,
      },
    });
    expect(() => makeDrone(drone))
        .toThrow('Drone home location error: Latitude must be between -90 ' +
                 'and 90.');
  });

  it('must have a valid home location latitude (below 90)', () => {
    const drone = makeFakeDrone({
      homeLocation: {
        latitude: 90.2,
        longitude: 22.22,
      },
    });
    expect(() => makeDrone(drone))
        .toThrow('Drone home location error: Latitude must be between -90 ' +
                 'and 90.');
  });

  it('must have a valid home location longitude (above -180)', () => {
    const drone = makeFakeDrone({
      homeLocation: {
        latitude: 43.23,
        longitude: -181,
      },
    });
    expect(() => makeDrone(drone))
        .toThrow('Drone home location error: Longitude must be between -180 ' +
                 'and 180.');
  });

  it('must have a valid home location longitude (below 180)', () => {
    const drone = makeFakeDrone({
      homeLocation: {
        latitude: 43.23,
        longitude: 181,
      },
    });
    expect(() => makeDrone(drone))
        .toThrow('Drone home location error: Longitude must be between -180 ' +
                 'and 180.');
  });

  it('must export getId', () => {
    const drone = makeFakeDrone();
    expect(uuidValidate(makeDrone(drone).getId())).toBe(true);
  });

  it('must export getSource', () => {
    const drone = makeFakeDrone();
    const createdSource = makeDrone(drone).getSource();
    expect(createdSource.getIp()).toBe(drone.source.ip);
    expect(createdSource.getBrowser()).toBe(drone.source.browser);
    expect(createdSource.getReferrer()).toBe(drone.source.referrer);
  });

  it('must export getHomeLocation', () => {
    const drone = makeFakeDrone();
    expect(makeDrone(drone).getHomeLocation()).toBe(drone.homeLocation);
  });

  it('must export getIsBusy', () => {
    const drone = makeFakeDrone();
    expect(makeDrone(drone).getIsBusy()).toBe(false);
  });

  it('must export getConnectedOn', () => {
    const drone = makeFakeDrone();
    expect(
        makeDrone(drone).getConnectedOn() / 1000,
    ).toBeCloseTo(Date.now() / 1000, 0.001);
  });

  it('must export markAsBusy', () => {
    const drone = makeFakeDrone();
    const createdDrone = makeDrone(drone);
    expect(createdDrone.getIsBusy()).toBe(false);
    createdDrone.markAsBusy();
    expect(createdDrone.getIsBusy()).toBe(true);
  });

  it('must export markAsNotBusy', () => {
    const drone = makeFakeDrone();
    const createdDrone = makeDrone(drone);
    expect(createdDrone.getIsBusy()).toBe(false);
    createdDrone.markAsBusy();
    expect(createdDrone.getIsBusy()).toBe(true);
    createdDrone.markAsNotBusy();
    expect(createdDrone.getIsBusy()).toBe(false);
  });
});
