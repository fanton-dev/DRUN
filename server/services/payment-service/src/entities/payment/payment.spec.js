import {validate as uuidValidate} from 'uuid';
import makeFakePayment from '../../../test/fixtures/payment';
import makePayment from './';

describe('payment', () => {
  it('must process a proper request', () => {
    const payment = makeFakePayment();
    expect(() => makePayment(payment)).not.toThrow();
  });

  it('must have a payment card', () => {
    const payment = makeFakePayment({paymentCard: null});
    expect(() => makePayment(payment))
        .toThrow('Card not defined.');
  });

  it('must have a payment card number', () => {
    const payment = makeFakePayment({
      paymentCard: {
        number: null,
        date: '12/68',
        CVC: '420',
      },
    });
    expect(
        () => makePayment(payment),
    ).toThrow('Card must have a number defined.');
  });

  it('must have a payment card date', () => {
    const payment = makeFakePayment({
      paymentCard: {
        number: '4242 4242 4242 4242',
        date: null,
        CVC: '420',
      },
    });
    expect(() => makePayment(payment))
        .toThrow('Card must have a date defined.');
  });

  it('must have a payment card CVC', () => {
    const payment = makeFakePayment({
      paymentCard: {
        number: '4242 4242 4242 4242',
        date: '12/68',
        CVC: null,
      },
    });
    expect(() => makePayment(payment))
        .toThrow('Card must have a CVC defined.');
  });

  it('must have a payment card number of only numbers and spaces', () => {
    const payment = makeFakePayment({
      paymentCard: {
        number: 'g4242o4242s4242 h4242o',
        date: '12/68',
        CVC: '420',
      },
    });
    expect(
        () => makePayment(payment),
    ).toThrow('Card number can only have numbers.');
  });

  it('must have a payment card number of 16 digits', () => {
    const payment = makeFakePayment({
      paymentCard: {
        number: '4242 4242 4242 424',
        date: '12/68',
        CVC: '420',
      },
    });
    expect(
        () => makePayment(payment),
    ).toThrow('Card number must contain 16 digits.');
  });

  it('must have a payment card date in MM/YY format', () => {
    const payment = makeFakePayment({
      paymentCard: {
        number: '4242 4242 4242 4242',
        date: '13/65',
        CVC: '420',
      },
    });
    expect(
        () => makePayment(payment),
    ).toThrow('Card date must be in MM/YY format.');
  });

  it('must have a payment card date which has not expired', () => {
    const payment = makeFakePayment({
      paymentCard: {
        number: '4242 4242 4242 4242',
        date: '10/16',
        CVC: '420',
      },
    });
    expect(
        () => makePayment(payment),
    ).toThrow('Card date must not have expired.');
  });

  it('must have a payment card CVC of only numbers', () => {
    const payment = makeFakePayment({
      paymentCard: {
        number: '4242 4242 4242 4242',
        date: '12/68',
        CVC: '42a0',
      },
    });
    expect(
        () => makePayment(payment),
    ).toThrow('Card CVC can only contain numbers.');
  });

  it('must have a payment card number of 3 digits', () => {
    const payment = makeFakePayment({
      paymentCard: {
        number: '4242 4242 4242 4242',
        date: '12/68',
        CVC: '4202',
      },
    });
    expect(
        () => makePayment(payment),
    ).toThrow('Card CVC must contain 3 digits.');
  });

  it('must export getId', () => {
    const payment = makeFakePayment();
    expect(uuidValidate(makePayment(payment).getId())).toBe(true);
  });

  it('must export getOrderId', () => {
    const payment = makeFakePayment();
    expect(makePayment(payment).getOrderId()).toBe(payment.orderId);
    expect(uuidValidate(makePayment(payment).getId())).toBe(true);
  });

  it('must export getPaymentCardNumber', () => {
    const payment = makeFakePayment();
    expect(makePayment(payment).getPaymentCardNumber())
        .toBe(payment.paymentCard.number);
  });

  it('must export getPaymentCardDate', () => {
    const payment = makeFakePayment();
    expect(makePayment(payment).getPaymentCardDate())
        .toBe(payment.paymentCard.date);
  });

  it('must export getPaymentCardCVC', () => {
    const payment = makeFakePayment();
    expect(makePayment(payment).getPaymentCardCVC())
        .toBe(payment.paymentCard.CVC);
  });

  it('must export getCreatedOn', () => {
    const payment = makeFakePayment();
    expect(Date(makePayment(payment).getCreatedOn()));
  });

  it('must export getCompletedOn', () => {
    const payment = makeFakePayment();
    expect(makePayment(payment).getCompletedOn()).toBe(undefined);
  });

  it('must export isCompleted', () => {
    const payment = makeFakePayment();
    const createdPayment = makePayment(payment);
    expect(createdPayment.isCompleted()).toBe(false);
    createdPayment.markAsCompleted();
    expect(createdPayment.isCompleted()).toBe(true);
  });

  it('must export markAsCompleted', () => {
    const payment = makeFakePayment();
    const createdPayment = makePayment(payment);
    expect(createdPayment.getCompletedOn()).toBe(undefined);
    createdPayment.markAsCompleted();
    expect(Date(createdPayment.getCompletedOn()));
  });
});
