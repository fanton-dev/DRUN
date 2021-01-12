import {Validator, Order} from '../../../../core/global';

/**
 * Orders entity builder containing all the information for further processing.
 *
 * @export
 * @param {{validator: Validator, generateIdentifier: Function}} {
 *   validator,
 *   generateIdentifier
 * } - dependency injection
 * @return {Function} - order object builder
 */
export default function buildMakeOrder({
  validator,
  generateIdentifier,
}: {validator: Validator, generateIdentifier: Function}): Function {
  return function makeOrder({
    sender,
    receiver,
    paymentCard,
  }: Order): object {
    // Internal parameters
    const id = generateIdentifier();
    const createdOn = Date.now();

    // Construction data validation
    // Identifier validation
    try {
      validator.validateIdentifier(id);
    } catch (e) {
      throw new Error('Order identifier error: ' + e.message);
    }

    // Sender validation
    if (!sender) {
      throw new Error('Order must have a sender.');
    }

    try {
      validator.validateIdentifier(sender.id);
      validator.validateLocation(sender.location);
    } catch (e) {
      throw new Error('Order sender error: ' + e.message);
    }

    // Receiver validation
    if (!receiver) {
      throw new Error('Order must have a receiver.');
    }

    try {
      validator.validateIdentifier(receiver.id);
      validator.validateLocation(receiver.location);
    } catch (e) {
      throw new Error('Order receiver error: ' + e.message);
    }

    // Payment card validation
    try {
      validator.validatePaymentCard(paymentCard);
    } catch (e) {
      throw new Error('Order payment card error: ' + e.message);
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
