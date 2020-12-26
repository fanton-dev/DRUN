import {v4 as uuidv4} from 'uuid';

/**
 * Provides a fake payment entity for testing.
 *
 * @export
 * @param {*} overrides
 * @return {*}
 */
export default function makeFakePayment(overrides) {
  const payment = {
    orderId: uuidv4,
    paymentCard: {
      number: '4242 4242 4242 4242',
      date: '12/68',
      CVC: '420',
    },
  };

  return {
    ...payment,
    ...overrides,
  };
}
