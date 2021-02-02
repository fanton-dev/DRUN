import {
  Delivery,
  LocationExport,
  Validator,
} from '../../../../core/@types/global';
import {exportToNormalEntity} from '../../../../core/entities/utilities';

// Defining the maximum flight distance in kilometers.
const maxDistanceRoute = 5;

/**
 * Deliveries entity containing coordinates of receiver and sender.
 *
 * @export
 * @param {{validator: Validator, generateIdentifier: Function}} {
 *   validator,
 *   generateIdentifier,
 * } - dependency injection
 * @return {Function} - delivery object builder
 */
export default function buildCreateDelivery({
  validator,
  generateIdentifier,
}: {validator: Validator, generateIdentifier: () => string}): Function {
  return function createDelivery({
    orderId,
    drone,
    senderLocation,
    receiverLocation,
  }: Delivery): object {
    // Internal parameters
    const id = generateIdentifier();
    const createdOn = Date.now();
    let completedOn: number | undefined = undefined;

    // Construction data validation
    // Identifier validation
    try {
      validator.validateIdentifier(id);
    } catch (e) {
      throw new Error('Delivery identifier error: ' + e.message);
    }

    try {
      validator.validateIdentifier(orderId);
    } catch (e) {
      throw new Error('Delivery identifier error: ' + e.message);
    }


    // Drone validation
    if (!drone) {
      throw new Error('Delivery must have a drone.');
    }

    try {
      validator.validateLocation(
          exportToNormalEntity(drone.getHomeLocation()),
      );
    } catch (e) {
      throw new Error('Delivery drone location error: ' + e.message);
    }

    // Sender location validation
    try {
      validator.validateLocation(senderLocation);
    } catch (e) {
      throw new Error('Delivery sender location error: ' + e.message);
    }

    // Receiver location validation
    try {
      validator.validateLocation(receiverLocation);
    } catch (e) {
      throw new Error('Delivery receiver location error: ' + e.message);
    }

    // Route length validation
    try {
      validator.validateRoute(
          exportToNormalEntity(drone.getHomeLocation()),
          senderLocation,
          receiverLocation,
          maxDistanceRoute,
      );
    } catch (e) {
      throw new Error('Delivery route error: ' + e.message);
    }

    // Creation date validation
    if (!createdOn) {
      throw new Error('Delivery must have a creation date.');
    }

    // Module exporting
    return Object.freeze({
      getId: (): string => id,
      getOrderId: (): string => orderId,
      getSenderLocation: (): LocationExport => Object.freeze({
        getLatitude: (): number => senderLocation.latitude,
        getLongitude: (): number => senderLocation.longitude,
      }),
      getReceiverLocation: (): LocationExport => Object.freeze({
        getLatitude: (): number => receiverLocation.latitude,
        getLongitude: (): number => receiverLocation.longitude,
      }),
      getDrone: () => drone,
      getCreatedOn: () => createdOn,
      getCompletedOn: () => completedOn,
      markAsCompleted: () => completedOn = Date.now(),
    });
  };
}
