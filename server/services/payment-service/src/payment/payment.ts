import {PaymentExport, Validator} from '@core/@types/entity-exports';
import {PaymentModel} from '@core/@types/models';

/**
 * Payment entity containing all the information of card payment.
 *
 * @export
 * @param {{validator: Validator, generateIdentifier: Function}} {
 *   validator,
 *   generateIdentifier,
 * } - dependency injection
 * @return {Function}
 */
export default function buildMakePayment({
  validator,
  generateIdentifier,
}: {validator: Validator, generateIdentifier: () => string}): Function {
  return function makePayment({
    id = generateIdentifier(),
    orderId,
    paymentCardToken,
    createdOn = Date.now(),
    completedOn = undefined,
  }: PaymentModel): PaymentExport {
    // Payment card validation
    validator.validateIdentifier(orderId);

    // TODO: paymentCardToken validation

    // Module exporting
    return Object.freeze({
      getId: (): string => id,
      getOrderId: (): string => orderId,
      getPaymentCardToken: (): string => paymentCardToken,
      getCreatedOn: (): number => createdOn,
      getCompletedOn: (): number | undefined => completedOn,
      isCompleted: (): boolean => completedOn ? true : false,
      markAsCompleted: (): number => completedOn = Date.now(),
    });
  };
}
