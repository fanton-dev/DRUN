import {Payment, Validator} from '../../../../core/global';

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
export default function buildCreatePayment({
  validator,
  generateIdentifier,
}: {validator: Validator, generateIdentifier: () => string}): Function {
  return function createPayment({
    orderId,
    paymentCard,
  }: Payment): object {
    // Internal parameters
    const id = generateIdentifier();
    const createdOn = Date.now();
    let completedOn: number = undefined;

    // Payment card validation
    validator.validatePaymentCard(paymentCard);

    // Module exporting
    return Object.freeze({
      getId: () => id,
      getOrderId: () => orderId,
      getPaymentCardNumber: () => paymentCard.number,
      getPaymentCardDate: () => paymentCard.date,
      getPaymentCardCVC: () => paymentCard.CVC,
      getCreatedOn: () => createdOn,
      getCompletedOn: () => completedOn,
      isCompleted: () => completedOn ? true : false,
      markAsCompleted: () => completedOn = Date.now(),
    });
  };
}
