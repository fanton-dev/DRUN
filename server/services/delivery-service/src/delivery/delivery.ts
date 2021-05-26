import {
  DeliveryExport, DroneExport, LocationExport, Validator
} from '@core/@types/entity-exports';
import {DeliveryModel} from '@core/@types/models';

// Defining the maximum flight distance in kilometers.
// TODO: Make an environment variable
const maxDistanceRoute = 5;

/**
 * Deliveries entity containing coordinates of receiver and sender.
 *
 * @export
 * @param {{
 *     validator: Validator,
 *     generateIdentifier: Function,
 *   }} {
 *   validator,
 *   generateIdentifier,
 * } - dependency injection
 * @return {Function} - delivery object builder
 */
export default function buildDelivery({
  validator,
  generateIdentifier,
}: {
    validator: Validator;
    generateIdentifier(): string;
  }): ({
    id, orderId, drone, senderLocation,
    receiverLocation, createdOn, completedOn,
  }: DeliveryModel) => DeliveryExport {
  return function makeDelivery({
    id = generateIdentifier(),
    orderId,
    drone,
    senderLocation,
    receiverLocation,
    createdOn = Date.now(),
    completedOn = undefined,
  }: DeliveryModel): DeliveryExport {
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
      validator.validateLocation({
        latitude: drone.getHomeLocation().getLatitude(),
        longitude: drone.getHomeLocation().getLongitude(),
      });
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
          {
            latitude: drone.getHomeLocation().getLatitude(),
            longitude: drone.getHomeLocation().getLongitude(),
          },
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
      getDrone: (): DroneExport => drone,
      setDrone: (droneExport: DroneExport) => drone = droneExport,
      getSenderLocation: (): LocationExport => Object.freeze({
        getLatitude: (): number => senderLocation.latitude,
        getLongitude: (): number => senderLocation.longitude,
      }),
      getReceiverLocation: (): LocationExport => Object.freeze({
        getLatitude: (): number => receiverLocation.latitude,
        getLongitude: (): number => receiverLocation.longitude,
      }),
      getCreatedOn: (): number => createdOn,
      getCompletedOn: (): number | undefined => completedOn,
      markAsCompleted: (): number => completedOn = Date.now(),
    });
  };
}
