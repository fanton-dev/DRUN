import {validate as uuidValidate} from 'uuid';
import makeFakePayment from '../../../test/fixtures/payment';
import makePayment from '.';

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
        cvc: '420',
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
        cvc: '420',
      },
    });
    expect(() => makePayment(payment))
        .toThrow('Card must have a date defined.');
  });

  it('must have a payment card cvc', () => {
    const payment = makeFakePayment({
      paymentCard: {
        number: '4242 4242 4242 4242',
        date: '12/68',
        cvc: null,
      },
    });
    expect(() => makePayment(payment))
        .toThrow('Card must have a cvc defined.');
  });

  it('must have a payment card number of only numbers and spaces', () => {
    const payment = makeFakePayment({
      paymentCard: {
        number: 'g4242o4242s4242 h4242o',
        date: '12/68',
        cvc: '420',
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
        cvc: '420',
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
        cvc: '420',
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
        cvc: '420',
      },
    });
    expect(
        () => makePayment(payment),
    ).toThrow('Card date must not have expired.');
  });

  it('must have a payment card cvc of only numbers', () => {
    const payment = makeFakePayment({
      paymentCard: {
        number: '4242 4242 4242 4242',
        date: '12/68',
        cvc: '42a0',
      },
    });
    expect(
        () => makePayment(payment),
    ).toThrow('Card cvc can only contain numbers.');
  });

  it('must have a payment card number of 3 digits', () => {
    const payment = makeFakePayment({
      paymentCard: {
        number: '4242 4242 4242 4242',
        date: '12/68',
        cvc: '4202',
      },
    });
    expect(
        () => makePayment(payment),
    ).toThrow('Card cvc must contain 3 digits.');
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

  it('must export getPaymentCard.getNumber', () => {
    const payment = makeFakePayment();
    expect(makePayment(payment).getPaymentCard().getNumber())
        .toBe(payment.paymentCard.number);
  });

  it('must export getPaymentCard.getDate', () => {
    const payment = makeFakePayment();
    expect(makePayment(payment).getPaymentCard().getDate())
        .toBe(payment.paymentCard.date);
  });

  it('must export getPaymentCard.getCvc', () => {
    const payment = makeFakePayment();
    expect(makePayment(payment).getPaymentCard().getCvc())
        .toBe(payment.paymentCard.cvc);
  });

  it('must export getPaymentCardToken', () => {
    const payment = makeFakePayment();
    expect(makePayment(payment).getPaymentCardToken()).toBe(undefined);
  });

  it('must export getCreatedOn', () => {
    const payment = makeFakePayment();
    expect(Date.parse(makePayment(payment).getCreatedOn()));
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

  it('must export setPaymentCardToken', () => {
    const payment = makeFakePayment();
    const createdPayment = makePayment(payment);
    const token = 'tok_1IG38FFW07knbpCOuaVOb7R7';
    expect(createdPayment.getPaymentCardToken()).toBe(undefined);
    createdPayment.setPaymentCardToken(token);
    expect(createdPayment.getPaymentCardToken()).toBe(token);
  });

  it('must export markAsCompleted', () => {
    const payment = makeFakePayment();
    const createdPayment = makePayment(payment);
    expect(createdPayment.getCompletedOn()).toBe(undefined);
    createdPayment.markAsCompleted();
    expect(Date.parse(makePayment(payment).getCompletedOn()));
  });
});
