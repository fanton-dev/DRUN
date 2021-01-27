import {validate as uuidValidate} from 'uuid';
import makeFakeOrder from '../../../test/fixtures/order';
import makeOrder from '.';

describe('order', () => {
  it('must process a proper order', () => {
    const order = makeFakeOrder();
    expect(() => makeOrder(order)).not.toThrow();
  });

  it('must have a sender', () => {
    const order = makeFakeOrder({sender: null});
    expect(() => makeOrder(order)).toThrow('Order must have a sender.');
  });

  it('must have a sender id', () => {
    const order = makeFakeOrder({
      sender: {
        id: null,
        location: {
          latitude: 43.33,
          longitude: 22.22,
        },
      },
    });
    expect(() => makeOrder(order))
        .toThrow('Order sender error: Identifier not defined.');
  });

  it('must have a valid sender id', () => {
    const order = makeFakeOrder({
      sender: {
        id: 'gosho@posho:88',
        location: {
          latitude: 43.33,
          longitude: 22.22,
        },
      },
    });
    expect(() => makeOrder(order))
        .toThrow('Order sender error: Identifier passed is invalid.');
  });

  it('must have a sender location', () => {
    const order = makeFakeOrder({
      sender: {
        id: 'f0a1889b-da86-4365-9007-08b86c50fc9a',
        location: null,
      },
    });
    expect(() => makeOrder(order))
        .toThrow('Order sender error: Location not defined.');
  });

  it('must have a sender location latitude', () => {
    const order = makeFakeOrder({
      sender: {
        id: 'f0a1889b-da86-4365-9007-08b86c50fc9a',
        location: {
          latitude: null,
          longitude: 22.22,
        },
      },
    });
    expect(() => makeOrder(order))
        .toThrow('Order sender error: Location must have a latitude defined.');
  });

  it('must have a numeric sender location latitude', () => {
    const order = makeFakeOrder({
      sender: {
        id: 'f0a1889b-da86-4365-9007-08b86c50fc9a',
        location: {
          latitude: 'gosho',
          longitude: 22.22,
        },
      },
    });
    expect(
        () => makeOrder(order),
    ).toThrow('Order sender error: Location latitude must be a number.');
  });

  it('must have a numeric sender location longitude', () => {
    const order = makeFakeOrder({
      sender: {
        id: 'f0a1889b-da86-4365-9007-08b86c50fc9a',
        location: {
          latitude: 43.44,
          longitude: 'posho',
        },
      },
    });
    expect(
        () => makeOrder(order),
    ).toThrow('Order sender error: Location longitude must be a number.');
  });

  it('must have a sender location longitude', () => {
    const order = makeFakeOrder({
      sender: {
        id: 'f0a1889b-da86-4365-9007-08b86c50fc9a',
        location: {
          latitude: 43.44,
          longitude: null,
        },
      },
    });
    expect(() => makeOrder(order))
        .toThrow('Order sender error: Location must have a longitude defined.');
  });

  it('must have a valid sender location latitude (above -90)', () => {
    const order = makeFakeOrder({
      sender: {
        id: 'f0a1889b-da86-4365-9007-08b86c50fc9a',
        location: {
          latitude: -90.2,
          longitude: 22.22,
        },
      },
    });
    expect(() => makeOrder(order))
        .toThrow('Order sender error: Latitude must be between -90 and 90.');
  });

  it('must have a valid sender location latitude (below 90)', () => {
    const order = makeFakeOrder({
      sender: {
        id: 'f0a1889b-da86-4365-9007-08b86c50fc9a',
        location: {
          latitude: 90.2,
          longitude: 22.22,
        },
      },
    });
    expect(() => makeOrder(order))
        .toThrow('Order sender error: Latitude must be between -90 and 90.');
  });

  it('must have a valid sender location longitude (above -180)', () => {
    const order = makeFakeOrder({
      sender: {
        id: 'f0a1889b-da86-4365-9007-08b86c50fc9a',
        location: {
          latitude: 43.23,
          longitude: -181,
        },
      },
    });
    expect(() => makeOrder(order))
        .toThrow('Order sender error: Longitude must be between -180 and 180.');
  });

  it('must have a valid sender location longitude (below 180)', () => {
    const order = makeFakeOrder({
      sender: {
        id: 'f0a1889b-da86-4365-9007-08b86c50fc9a',
        location: {
          latitude: 43.23,
          longitude: 181,
        },
      },
    });
    expect(() => makeOrder(order))
        .toThrow('Order sender error: Longitude must be between -180 and 180.');
  });

  it('must have a receiver', () => {
    const order = makeFakeOrder({receiver: null});
    expect(() => makeOrder(order)).toThrow('Order must have a receiver.');
  });

  it('must have a receiver id', () => {
    const order = makeFakeOrder({
      receiver: {
        id: null,
        location: {
          latitude: 43.33,
          longitude: 22.22,
        },
      },
    });
    expect(() => makeOrder(order))
        .toThrow('Order receiver error: Identifier not defined.');
  });

  it('must have a valid receiver id', () => {
    const order = makeFakeOrder({
      receiver: {
        id: 'gosho@posho:88',
        location: {
          latitude: 43.33,
          longitude: 22.22,
        },
      },
    });
    expect(() => makeOrder(order))
        .toThrow('Order receiver error: Identifier passed is invalid.');
  });

  it('must have a receiver location', () => {
    const order = makeFakeOrder({
      receiver: {
        id: 'f0a1889b-da86-4365-9007-08b86c50fc9a',
        location: null,
      },
    });
    expect(() => makeOrder(order))
        .toThrow('Order receiver error: Location not defined.');
  });

  it('must have a receiver location latitude', () => {
    const order = makeFakeOrder({
      receiver: {
        id: 'f0a1889b-da86-4365-9007-08b86c50fc9a',
        location: {
          latitude: null,
          longitude: 22.22,
        },
      },
    });
    expect(
        () => makeOrder(order),
    ).toThrow('Order receiver error: Location must have a latitude defined.');
  });

  it('must have a receiver location longitude', () => {
    const order = makeFakeOrder({
      receiver: {
        id: 'f0a1889b-da86-4365-9007-08b86c50fc9a',
        location: {
          latitude: 43.44,
          longitude: null,
        },
      },
    });
    expect(
        () => makeOrder(order),
    ).toThrow('Order receiver error: Location must have a longitude defined.');
  });

  it('must have a numeric receiver location latitude', () => {
    const order = makeFakeOrder({
      receiver: {
        id: 'f0a1889b-da86-4365-9007-08b86c50fc9a',
        location: {
          latitude: 'gosho',
          longitude: 22.22,
        },
      },
    });
    expect(
        () => makeOrder(order),
    ).toThrow('Order receiver error: Location latitude must be a number.');
  });

  it('must have a numeric receiver location longitude', () => {
    const order = makeFakeOrder({
      receiver: {
        id: 'f0a1889b-da86-4365-9007-08b86c50fc9a',
        location: {
          latitude: 43.44,
          longitude: 'posho',
        },
      },
    });
    expect(
        () => makeOrder(order),
    ).toThrow('Order receiver error: Location longitude must be a number.');
  });

  it('must have a valid receiver location latitude (above -90)', () => {
    const order = makeFakeOrder({
      receiver: {
        id: 'f0a1889b-da86-4365-9007-08b86c50fc9a',
        location: {
          latitude: -90.2,
          longitude: 22.22,
        },
      },
    });
    expect(() => makeOrder(order))
        .toThrow('Order receiver error: Latitude must be between -90 and 90.');
  });

  it('must have a valid receiver location latitude (below 90)', () => {
    const order = makeFakeOrder({
      receiver: {
        id: 'f0a1889b-da86-4365-9007-08b86c50fc9a',
        location: {
          latitude: 90.2,
          longitude: 22.22,
        },
      },
    });
    expect(() => makeOrder(order))
        .toThrow('Order receiver error: Latitude must be between -90 and 90.');
  });

  it('must have a valid receiver location longitude (above -180)', () => {
    const order = makeFakeOrder({
      receiver: {
        id: 'f0a1889b-da86-4365-9007-08b86c50fc9a',
        location: {
          latitude: 43.23,
          longitude: -181,
        },
      },
    });
    expect(
        () => makeOrder(order),
    ).toThrow('Order receiver error: Longitude must be between -180 and 180.');
  });

  it('must have a valid receiver location longitude (below 180)', () => {
    const order = makeFakeOrder({
      receiver: {
        id: 'f0a1889b-da86-4365-9007-08b86c50fc9a',
        location: {
          latitude: 43.23,
          longitude: 181,
        },
      },
    });
    expect(
        () => makeOrder(order),
    ).toThrow('Order receiver error: Longitude must be between -180 and 180.');
  });

  it('must have a payment card', () => {
    const order = makeFakeOrder({paymentCard: null});
    expect(() => makeOrder(order))
        .toThrow('Order payment card error: Card not defined.');
  });

  it('must have a payment card number', () => {
    const order = makeFakeOrder({
      paymentCard: {
        number: null,
        date: '12/68',
        CVC: '420',
      },
    });
    expect(
        () => makeOrder(order),
    ).toThrow('Order payment card error: Card must have a number defined.');
  });

  it('must have a payment card date', () => {
    const order = makeFakeOrder({
      paymentCard: {
        number: '4242 4242 4242 4242',
        date: null,
        CVC: '420',
      },
    });
    expect(() => makeOrder(order))
        .toThrow('Order payment card error: Card must have a date defined.');
  });

  it('must have a payment card CVC', () => {
    const order = makeFakeOrder({
      paymentCard: {
        number: '4242 4242 4242 4242',
        date: '12/68',
        CVC: null,
      },
    });
    expect(() => makeOrder(order))
        .toThrow('Order payment card error: Card must have a CVC defined.');
  });

  it('must have a payment card number of only numbers and spaces', () => {
    const order = makeFakeOrder({
      paymentCard: {
        number: 'g4242o4242s4242 h4242o',
        date: '12/68',
        CVC: '420',
      },
    });
    expect(
        () => makeOrder(order),
    ).toThrow('Order payment card error: Card number can only have numbers.');
  });

  it('must have a payment card number of 16 digits', () => {
    const order = makeFakeOrder({
      paymentCard: {
        number: '4242 4242 4242 424',
        date: '12/68',
        CVC: '420',
      },
    });
    expect(
        () => makeOrder(order),
    ).toThrow('Order payment card error: Card number must contain 16 digits.');
  });

  it('must have a payment card date in MM/YY format', () => {
    const order = makeFakeOrder({
      paymentCard: {
        number: '4242 4242 4242 4242',
        date: '13/65',
        CVC: '420',
      },
    });
    expect(
        () => makeOrder(order),
    ).toThrow('Order payment card error: Card date must be in MM/YY format.');
  });

  it('must have a payment card date which has not expired', () => {
    const order = makeFakeOrder({
      paymentCard: {
        number: '4242 4242 4242 4242',
        date: '10/16',
        CVC: '420',
      },
    });
    expect(
        () => makeOrder(order),
    ).toThrow('Order payment card error: Card date must not have expired.');
  });

  it('must have a payment card CVC of only numbers', () => {
    const order = makeFakeOrder({
      paymentCard: {
        number: '4242 4242 4242 4242',
        date: '12/68',
        CVC: '42a0',
      },
    });
    expect(
        () => makeOrder(order),
    ).toThrow('Order payment card error: Card CVC can only contain numbers.');
  });

  it('must have a payment card number of 3 digits', () => {
    const order = makeFakeOrder({
      paymentCard: {
        number: '4242 4242 4242 4242',
        date: '12/68',
        CVC: '4202',
      },
    });
    expect(
        () => makeOrder(order),
    ).toThrow('Order payment card error: Card CVC must contain 3 digits.');
  });

  it('must export getId', () => {
    const order = makeFakeOrder();
    expect(uuidValidate(makeOrder(order).getId())).toBe(true);
  });

  it('must export getSender.getId', () => {
    const order = makeFakeOrder();
    expect(makeOrder(order).getSender().getId()).toBe(order.sender.id);
  });

  it('must export getSender.getLocation.getLatitude', () => {
    const order = makeFakeOrder();
    expect(makeOrder(order).getSender().getLocation().getLatitude())
        .toBe(order.sender.location.latitude);
  });

  it('must export getSender.getLocation.getLongitude', () => {
    const order = makeFakeOrder();
    expect(makeOrder(order).getSender().getLocation().getLongitude())
        .toBe(order.sender.location.longitude);
  });

  it('must export getReceiver.getId', () => {
    const order = makeFakeOrder();
    expect(makeOrder(order).getReceiver().getId()).toBe(order.receiver.id);
  });

  it('must export getReceiver.getLocation.getLatitude', () => {
    const order = makeFakeOrder();
    expect(makeOrder(order).getReceiver().getLocation().getLatitude())
        .toBe(order.receiver.location.latitude);
  });

  it('must export getReceiver.getLocation.getLongitude', () => {
    const order = makeFakeOrder();
    expect(makeOrder(order).getReceiver().getLocation().getLongitude())
        .toBe(order.receiver.location.longitude);
  });

  it('must export getPaymentCard.getNumber', () => {
    const order = makeFakeOrder();
    expect(makeOrder(order).getPaymentCard().getNumber())
        .toBe(order.paymentCard.number);
  });

  it('must export getPaymentCard.getDate', () => {
    const order = makeFakeOrder();
    expect(makeOrder(order).getPaymentCard().getDate())
        .toBe(order.paymentCard.date);
  });

  it('must export getPaymentCard.getCVC', () => {
    const order = makeFakeOrder();
    expect(makeOrder(order).getPaymentCard().getCVC())
        .toBe(order.paymentCard.CVC);
  });

  it('must export getSource.getIp', () => {
    const order = makeFakeOrder();
    expect(makeOrder(order).getSource().getIp())
        .toBe(order.source.ip);
  });

  it('must export getSource.getReference', () => {
    const order = makeFakeOrder();
    expect(makeOrder(order).getSource().getIp())
        .toBe(order.source.ip);
  });

  it('must export getSource.getBrowser', () => {
    const order = makeFakeOrder();
    expect(makeOrder(order).getSource().getBrowser())
        .toBe(order.source.browser);
  });

  it('must export getCreatedOn', () => {
    const order = makeFakeOrder();
    expect(Date.parse(makeOrder(order).getCreatedOn()));
  });
});
