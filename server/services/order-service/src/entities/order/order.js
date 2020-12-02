/**
 * Orders entity containing all the information for further processing.
 *
 * @export
 * @param {Object} validator - data validator dependency injection
 * @param {Object} generateIdentifier - id generator dependency injection
 * @return {Function} - order object builder
 */
export default function buildMakeOrder(validator, generateIdentifier) {
  return function makeOrder({
    id = generateIdentifier(),
    sender,
    receiver,
    paymentCard,
    createdOn = Date.now(),
  } = {}) {
    // Construction data validation
    // Identifier validation
    try {
      validator.validateIdentifier(id, 'internal');
    } catch (err) {
      throw new Error('Order identifier error: ' + err.message);
    }

    // Sender validation
    if (!sender) {
      throw new Error('Order must have a sender.');
    }

    try {
      validator.validateIdentifier(sender.id, 'firebase');
      validator.validateLocation(sender.location);
    } catch (err) {
      throw new Error('Order sender error: ' + err.message);
    }

    // Receiver validation
    if (!receiver) {
      throw new Error('Order must have a receiver.');
    }

    try {
      validator.validateIdentifier(receiver.id, 'firebase');
      validator.validateLocation(receiver.location);
    } catch (err) {
      throw new Error('Order receiver error: ' + err.message);
    }

    // Payment card validation
    try {
      validator.validatePaymentCard(paymentCard);
    } catch (err) {
      throw new Error('Order payment card error: ' + err.message);
    }

    // Creation date validation
    if (!createdOn) {
      throw new Error('Order must have a creation date.');
    }

    // Removing spaces from the card number
    paymentCard.number = paymentCard.number.replace(/ /g, '');

    // Module exporting
    return Object.freeze({
      getId: () => id,
      getSenderId: () => sender.id,
      getSenderLocation: () => sender.location,
      getReceiverId: () => receiver.id,
      getReceiverLocation: () => receiver.location,
      getPaymentCardNumber: () => paymentCard.number,
      getPaymentCardDate: () => paymentCard.date,
      getPaymentCardCVC: () => paymentCard.CVC,
      getCreatedOn: () => createdOn,
    });
  };
}
