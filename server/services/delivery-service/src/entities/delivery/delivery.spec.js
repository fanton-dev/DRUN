import {validate as uuidValidate} from 'uuid';
import makeFakeDelivery from '../../../test/fixtures/delivery';
import makeDelivery from '.';

describe('delivery', () => {
  it('must process a proper request', () => {
    const delivery = makeFakeDelivery();
    expect(() => makeDelivery(delivery)).not.toThrow();
  });

  it('must have a order id', () => {
    const delivery = makeFakeDelivery({orderId: null});
    expect(() => makeDelivery(delivery))
        .toThrow('Delivery identifier error: Identifier not defined.');
  });

  it('must have a drone', () => {
    const delivery = makeFakeDelivery({drone: null});
    expect(() => makeDelivery(delivery)).toThrow('Delivery must have a drone.');
  });

  it('must have a valid drone object', () => {
    const delivery = makeFakeDelivery({drone: {'random': 'object'}});
    expect(() => makeDelivery(delivery))
        .toThrow('Delivery must have a valid drone object.');
  });

  it('must have a sender location', () => {
    const delivery = makeFakeDelivery({
      senderLocation: null,
    });
    expect(() => makeDelivery(delivery))
        .toThrow('Delivery sender location error: Location not defined.');
  });

  it('must have a sender location latitude', () => {
    const delivery = makeFakeDelivery({
      senderLocation: {
        latitude: null,
        longitude: 22.22,
      },
    });
    expect(() => makeDelivery(delivery))
        .toThrow('Delivery sender location error: Location must have a ' +
                 'latitude defined.');
  });

  it('must have a numeric sender location latitude', () => {
    const delivery = makeFakeDelivery({
      senderLocation: {
        latitude: 'gosho',
        longitude: 22.22,
      },
    });
    expect(
        () => makeDelivery(delivery),
    ).toThrow('Delivery sender location error: Location latitude must be ' +
              'a number.');
  });

  it('must have a numeric sender location longitude', () => {
    const delivery = makeFakeDelivery({
      senderLocation: {
        latitude: 43.44,
        longitude: 'posho',
      },
    });
    expect(
        () => makeDelivery(delivery),
    ).toThrow('Delivery sender location error: Location longitude must be ' +
              'a number.');
  });

  it('must have a sender location longitude', () => {
    const delivery = makeFakeDelivery({
      senderLocation: {
        latitude: 43.44,
        longitude: null,
      },
    });
    expect(() => makeDelivery(delivery))
        .toThrow('Delivery sender location error: Location must have a ' +
                 'longitude defined.');
  });

  it('must have a valid sender location latitude (above -90)', () => {
    const delivery = makeFakeDelivery({
      senderLocation: {
        latitude: -90.2,
        longitude: 22.22,
      },
    });
    expect(() => makeDelivery(delivery))
        .toThrow('Delivery sender location error: Latitude must be between ' +
                 '-90 and 90.');
  });

  it('must have a valid sender location latitude (below 90)', () => {
    const delivery = makeFakeDelivery({
      senderLocation: {
        latitude: 90.2,
        longitude: 22.22,
      },
    });
    expect(() => makeDelivery(delivery))
        .toThrow('Delivery sender location error: Latitude must be between ' +
                 '-90 and 90.');
  });

  it('must have a valid sender location longitude (above -180)', () => {
    const delivery = makeFakeDelivery({
      senderLocation: {
        latitude: 43.23,
        longitude: -181,
      },
    });
    expect(() => makeDelivery(delivery))
        .toThrow('Delivery sender location error: Longitude must be ' +
                 'between -180 and 180.');
  });

  it('must have a valid sender location longitude (below 180)', () => {
    const delivery = makeFakeDelivery({
      senderLocation: {
        latitude: 43.23,
        longitude: 181,
      },
    });
    expect(() => makeDelivery(delivery))
        .toThrow('Delivery sender location error: Longitude must be ' +
                 'between -180 and 180.');
  });

  it('must have a receiver location', () => {
    const delivery = makeFakeDelivery({
      receiverLocation: null,
    });
    expect(() => makeDelivery(delivery))
        .toThrow('Delivery receiver location error: Location not defined.');
  });

  it('must have a receiver location latitude', () => {
    const delivery = makeFakeDelivery({
      receiverLocation: {
        latitude: null,
        longitude: 22.22,
      },
    });
    expect(() => makeDelivery(delivery))
        .toThrow('Delivery receiver location error: Location must have a ' +
                 'latitude defined.');
  });

  it('must have a numeric receiver location latitude', () => {
    const delivery = makeFakeDelivery({
      receiverLocation: {
        latitude: 'gosho',
        longitude: 22.22,
      },
    });
    expect(
        () => makeDelivery(delivery),
    ).toThrow('Delivery receiver location error: Location latitude must be ' +
              'a number.');
  });

  it('must have a numeric receiver location longitude', () => {
    const delivery = makeFakeDelivery({
      receiverLocation: {
        latitude: 43.44,
        longitude: 'posho',
      },
    });
    expect(
        () => makeDelivery(delivery),
    ).toThrow('Delivery receiver location error: Location longitude must be ' +
              'a number.');
  });

  it('must have a receiver location longitude', () => {
    const delivery = makeFakeDelivery({
      receiverLocation: {
        latitude: 43.44,
        longitude: null,
      },
    });
    expect(() => makeDelivery(delivery))
        .toThrow('Delivery receiver location error: Location must have a ' +
                 'longitude defined.');
  });

  it('must have a valid receiver location latitude (above -90)', () => {
    const delivery = makeFakeDelivery({
      receiverLocation: {
        latitude: -90.2,
        longitude: 22.22,
      },
    });
    expect(() => makeDelivery(delivery))
        .toThrow('Delivery receiver location error: Latitude must be between ' +
                 '-90 and 90.');
  });

  it('must have a valid receiver location latitude (below 90)', () => {
    const delivery = makeFakeDelivery({
      receiverLocation: {
        latitude: 90.2,
        longitude: 22.22,
      },
    });
    expect(() => makeDelivery(delivery))
        .toThrow('Delivery receiver location error: Latitude must be between ' +
                 '-90 and 90.');
  });

  it('must have a valid receiver location longitude (above -180)', () => {
    const delivery = makeFakeDelivery({
      receiverLocation: {
        latitude: 43.23,
        longitude: -181,
      },
    });
    expect(() => makeDelivery(delivery))
        .toThrow('Delivery receiver location error: Longitude must be ' +
                 'between -180 and 180.');
  });

  it('must have a valid receiver location longitude (below 180)', () => {
    const delivery = makeFakeDelivery({
      receiverLocation: {
        latitude: 43.23,
        longitude: 181,
      },
    });
    expect(() => makeDelivery(delivery))
        .toThrow('Delivery receiver location error: Longitude must be ' +
                 'between -180 and 180.');
  });

  it('must export getId', () => {
    const delivery = makeFakeDelivery();
    expect(uuidValidate(makeDelivery(delivery).getId())).toBe(true);
  });

  it('must export getOrderId', () => {
    const delivery = makeFakeDelivery();
    expect(makeDelivery(delivery).getOrderId()).toBe(delivery.orderId);
  });

  it('must export getSenderLocation', () => {
    const delivery = makeFakeDelivery();
    expect(makeDelivery(delivery).getSenderLocation())
        .toBe(delivery.senderLocation);
  });

  it('must export getReceiverLocation', () => {
    const delivery = makeFakeDelivery();
    expect(makeDelivery(delivery).getReceiverLocation())
        .toBe(delivery.receiverLocation);
  });

  it('must export getDrone', () => {
    const delivery = makeFakeDelivery();
    expect(makeDelivery(delivery).getDrone());
  });

  it('must export getCreatedOn', () => {
    const delivery = makeFakeDelivery();
    expect(Date(makeDelivery(delivery).getCreatedOn()));
  });

  it('must export getCompletedOn', () => {
    const delivery = makeFakeDelivery();
    expect(Date(makeDelivery(delivery).getCompletedOn()));
  });

  it('must export markAsCompleted', () => {
    const delivery = makeFakeDelivery();
    expect(makeDelivery(delivery).markAsCompleted());
  });
});
