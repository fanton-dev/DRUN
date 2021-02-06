import {
  Validator,
  Order,
  SourceExport,
  Source,
} from '../../../../core/@types/global';

/**
 * Orders entity builder containing all the information for further processing.
 *
 * @export
 * @param {{
 *   validator: Validator,
 *   generateIdentifier: Function,
 *   makeSource: Function
 * }} {
 *   validator,
 *   generateIdentifier,
 *   makeSource,
 * } - dependency injection
 * @return {Function} - order object builder
 */
export default function buildMakeOrder({
  validator,
  generateIdentifier,
  makeSource,
}: {
  validator: Validator,
  generateIdentifier: () => string,
  makeSource: ({ip, browser, referrer}: Source) => SourceExport
}): Function {
  return function makeOrder({
    id = generateIdentifier(),
    sender,
    receiver,
    paymentCard,
    source,
    createdOn = Date.now(),
  }: Order): object {
    // Internal parameters
    let validSource: SourceExport;

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

    // Source validation + parsing
    if (!source) {
      throw new Error('Drone must have a source.');
    }

    try {
      validSource = makeSource(source);
    } catch (e) {
      throw new Error('Drone source error: ' + e.message);
    }


    // Module exporting
    return Object.freeze({
      getId: () => id,
      getSender: () => Object.freeze({
        getId: () => sender.id,
        getLocation: () => Object.freeze({
          getLatitude: () => sender.location.latitude,
          getLongitude: () => sender.location.longitude,
        }),
      }),
      getReceiver: () => Object.freeze({
        getId: () => receiver.id,
        getLocation: () => Object.freeze({
          getLatitude: () => receiver.location.latitude,
          getLongitude: () => receiver.location.longitude,
        }),
      }),
      getPaymentCard: () => Object.freeze({
        getNumber: () => paymentCard.number,
        getDate: () => paymentCard.date,
        getCvc: () => paymentCard.cvc,
      }),
      getSource: () => validSource,
      getCreatedOn: () => createdOn,
    });
  };
}
