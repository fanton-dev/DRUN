/**
 * Payment entity containing all the information of card payment.
 *
 * @export
 * @param {Object} validator - data validator dependency injection
 * @param {Object} generateIdentifier - id generator dependency injection
 * @return {function} - payment object builder
 */
export default function buildCreatePayment(validator, generateIdentifier) {
  return function createPayment({
    id = generateIdentifier(),
    orderId,
    paymentCard,
    createdOn = Date.now(),
    completedOn = undefined,
  } = {}) {
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
