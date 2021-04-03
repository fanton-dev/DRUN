import {
  OrderExport, SourceExport, Validator
} from '@core/@types/entity-exports';
import {OrderModel, SourceModel} from '@core/@types/models';

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
export default function buildOrder({
  validator,
  generateIdentifier,
  makeSource,
}: {
  validator: Validator,
  generateIdentifier: () => string,
  makeSource: ({ip, browser, referrer}: SourceModel) => SourceExport
}): ({
  id, sender, receiver, paymentCardToken, source, createdOn,
}: OrderModel) => OrderExport {
  return function makeOrder({
    id = generateIdentifier(),
    sender,
    receiver,
    paymentCardToken,
    source,
    createdOn = Date.now(),
  }: OrderModel): OrderExport {
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
    if (!paymentCardToken) {
      throw new Error('Order payment card token error: Token not defined.');
    }

    // Creation date validation
    if (!createdOn) {
      throw new Error('Order must have a creation date.');
    }

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
      getPaymentCardToken: () => paymentCardToken,
      getSource: () => validSource,
      getCreatedOn: () => createdOn,
    });
  };
}
