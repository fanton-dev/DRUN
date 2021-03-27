import {PaymentModel} from '@core/@types/models';
import {v4 as uuidv4} from 'uuid';

/**
 * Provides a builder for fake testing payment entities.
 *
 * @export
 * @param {object} [overrides] - data override for fake payment
 * @return {PaymentModel} - fake payment object
 */
export default function makeFakePayment(overrides?: object): PaymentModel {
  const payment = {
    orderId: uuidv4(),
    paymentCardToken: 'tok_1IG38FFW07knbpCOuaVOb7R7',
  };

  return {
    ...payment,
    ...overrides,
  };
}
