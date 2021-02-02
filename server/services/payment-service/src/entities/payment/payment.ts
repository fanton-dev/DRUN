import {
  Payment,
  PaymentCardExport,
  PaymentExport,
  Validator,
} from '../../../../core/@types/global';

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
    orderId,
    paymentCard,
  }: Payment): PaymentExport {
    // Internal parameters
    const id = generateIdentifier();
    const createdOn = Date.now();
    let paymentCardToken: string | undefined = undefined;
    let completedOn: number | undefined = undefined;

    // Payment card validation
    validator.validatePaymentCard(paymentCard);

    // Module exporting
    return Object.freeze({
      getId: (): string => id,
      getOrderId: (): string => orderId,
      getPaymentCard: (): PaymentCardExport => Object.freeze({
        getNumber: (): string => paymentCard.number,
        getDate: (): string => paymentCard.date,
        getCvc: (): string => paymentCard.cvc,
      }),
      getPaymentCardToken: (): string | undefined => paymentCardToken,
      getCreatedOn: (): number => createdOn,
      getCompletedOn: (): number | undefined => completedOn,
      isCompleted: (): boolean => completedOn ? true : false,
      setPaymentCardToken: (token: string): string => paymentCardToken = token,
      markAsCompleted: (): number => completedOn = Date.now(),
    });
  };
}
