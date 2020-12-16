/**
 * Drones entity containing the information of a delivery drone.
 *
 * @export
 * @param {Object} validator - data validator dependency injection
 * @param {Object} generateIdentifier - id generator dependency injection
 * @param {Object} makeSource - ip source dependency injection
 * @return {function} - drone object builder
 */
export default function buildCreateDrone(
    validator,
    generateIdentifier,
    makeSource,
) {
  return function createDrone({
    droneSource,
    homeLocation,
  } = {}) {
    // Internal parameters
    const id = generateIdentifier();
    let isBusy = false;
    const connectedOn = Date.now();

    // Source validation + parsing
    if (!droneSource) {
      throw new Error('Drone must have a source.');
    }

    try {
      droneSource = makeSource(droneSource);
    } catch (err) {
      throw new Error('Drone source error: ' + err.message);
    }

    // Construction data validation
    // Identifier validation
    try {
      validator.validateIdentifier(id, 'internal');
    } catch (err) {
      throw new Error('Drone identifier error: ' + err.message);
    }

    // Home location validation
    try {
      validator.validateLocation(homeLocation);
    } catch (err) {
      throw new Error('Drone home location error: ' + err.message);
    }

    // Module exporting
    return Object.freeze({
      getId: () => id,
      getDroneSource: () => droneSource,
      getHomeLocation: () => homeLocation,
      getIsBusy: () => isBusy,
      getDrone: () => drone,
      getConnectedOn: () => connectedOn,
      markAsBusy: () => isBusy = true,
      markAsNotBusy: () => isBusy = false,
    });
  };
}
