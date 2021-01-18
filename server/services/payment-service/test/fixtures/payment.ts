import {v4 as uuidv4} from 'uuid';
import {Payment} from '../../../core/@types/global';

/**
 * Provides a builder for fake testing payment entities.
 *
 * @export
 * @param {object} [overrides] - data override for fake payment
 * @return {Payment} - fake payment object
 */
export default function makeFakePayment(overrides?: object): Payment {
  const payment = {
    orderId: uuidv4(),
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
