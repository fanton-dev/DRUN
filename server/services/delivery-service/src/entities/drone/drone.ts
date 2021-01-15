import {Drone, Source, SourceExport, Validator} from '../../../../core/global';

/**
 * Drones entity containing the information of a delivery drone.
 *
 * @export
 * @param {Object} validator - data validator dependency injection
 * @param {Object} generateIdentifier - id generator dependency injection
 * @param {Object} makeSource - ip source dependency injection
 * @return {function} - drone object builder
 */
export default function buildCreateDrone({
  validator,
  generateIdentifier,
  makeSource,
}: {
  validator: Validator,
  generateIdentifier: () => string,
  makeSource: ({ip, browser, referrer}: Source) => SourceExport
}) {
  return function createDrone({
    droneSource,
    homeLocation,
  }: Drone) {
    // Internal parameters
    const id = generateIdentifier();
    let isBusy = false;
    const connectedOn = Date.now();
    let validDroneSource: SourceExport;

    // Source validation + parsing
    if (!droneSource) {
      throw new Error('Drone must have a source.');
    }

    try {
      validDroneSource = makeSource(droneSource);
    } catch (e) {
      throw new Error('Drone source error: ' + e.message);
    }

    // Construction data validation
    // Identifier validation
    try {
      validator.validateIdentifier(id);
    } catch (e) {
      throw new Error('Drone identifier error: ' + e.message);
    }

    // Home location validation
    try {
      validator.validateLocation(homeLocation);
    } catch (e) {
      throw new Error('Drone home location error: ' + e.message);
    }

    // Module exporting
    return Object.freeze({
      getId: () => id,
      getDroneSource: () => validDroneSource,
      getHomeLocation: () => homeLocation,
      getIsBusy: () => isBusy,
      getConnectedOn: () => connectedOn,
      markAsBusy: () => isBusy = true,
      markAsNotBusy: () => isBusy = false,
    });
  };
}
