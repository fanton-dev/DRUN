import {validate as uuidValidate} from 'uuid';
import makePayment from '.';
import makeFakePayment from '../../test/fixtures/payment';

describe('payment', () => {
  it('must process a proper request', () => {
    const payment = makeFakePayment();
    expect(() => makePayment(payment)).not.toThrow();
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

  it('must export getPaymentCardToken', () => {
    const payment = makeFakePayment();
    const createdPayment = makePayment(payment);
    const token = 'tok_1IG38FFW07knbpCOuaVOb7R7';
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
