// Defining the maximum flight distance in kilometers.
const maxDistanceRoute = 5;

/**
 * Deliveries entity containing coordinates of receiver and sender.
 *
 * @export
 * @param {Object} validator - data validator dependency injection
 * @param {Object} generateIdentifier - id generator dependency injection
 * @return {function} - delivery object builder
 */
export default function buildCreateDelivery(validator, generateIdentifier) {
  return function createDelivery({
    orderId,
    drone,
    senderLocation,
    receiverLocation,
  } = {}) {
    // Internal parameters
    const id = generateIdentifier();
    const createdOn = Date.now();
    let completedOn;

    // Construction data validation
    // Identifier validation
    try {
      validator.validateIdentifier(id, 'internal');
    } catch (err) {
      throw new Error('Delivery identifier error: ' + err.message);
    }

    try {
      validator.validateIdentifier(orderId, 'internal');
    } catch (err) {
      throw new Error('Delivery identifier error: ' + err.message);
    }


    // Drone validation
    if (!drone) {
      throw new Error('Delivery must have a drone.');
    }

    if (!(
      'getId' in drone &&
      'getDroneSource' in drone &&
      'getHomeLocation' in drone &&
      'getIsBusy' in drone &&
      'getDrone' in drone &&
      'getConnectedOn' in drone &&
      'markAsBusy' in drone &&
      'markAsNotBusy' in drone
    )) {
      throw new Error('Delivery must have a valid drone object.');
    }

    try {
      validator.validateLocation(drone.getHomeLocation());
    } catch (err) {
      throw new Error('Delivery drone location error: ' + err.message);
    }

    // Sender location validation
    try {
      validator.validateLocation(senderLocation);
    } catch (err) {
      throw new Error('Delivery sender location error: ' + err.message);
    }

    // Receiver location validation
    try {
      validator.validateLocation(receiverLocation);
    } catch (err) {
      throw new Error('Delivery receiver location error: ' + err.message);
    }

    // Route length validation
    try {
      validator.validateRoute(
          drone.getHomeLocation(),
          senderLocation,
          receiverLocation,
          maxDistanceRoute,
      );
    } catch (err) {
      throw new Error('Delivery route error: ' + err.message);
    }

    // Creation date validation
    if (!createdOn) {
      throw new Error('Delivery must have a creation date.');
    }

    // Module exporting
    return Object.freeze({
      getId: () => id,
      getOrderId: () => orderId,
      getSenderLocation: () => senderLocation,
      getReceiverLocation: () => receiverLocation,
      getDrone: () => drone,
      getCreatedOn: () => createdOn,
      getCompletedOn: () => completedOn,
      markAsCompleted: () => completedOn = Date.now(),
    });
  };
}
