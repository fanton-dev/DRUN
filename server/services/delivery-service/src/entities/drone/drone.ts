import {Drone, Source, SourceExport, Validator} from '../../../../core/@types/global';

/**
 * Drones entity containing the information of a delivery drone.
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
 * @return {Function} - drone object builder
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
    source,
    homeLocation,
  }: Drone) {
    // Internal parameters
    const id = generateIdentifier();
    let isBusy = false;
    const connectedOn = Date.now();
    let validSource: SourceExport;

    // Source validation + parsing
    if (!source) {
      throw new Error('Drone must have a source.');
    }

    try {
      validSource = makeSource(source);
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
      getDroneSource: () => validSource,
      getHomeLocation: () => homeLocation,
      getIsBusy: () => isBusy,
      getSource: () => validSource,
      getConnectedOn: () => connectedOn,
      markAsBusy: () => isBusy = true,
      markAsNotBusy: () => isBusy = false,
    });
  };
}
