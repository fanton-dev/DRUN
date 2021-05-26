import {
  DroneExport, LocationExport, SourceExport, Validator,
} from '@core/@types/entity-exports';
import {DroneModel, SourceModel} from '@core/@types/models';

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
export default function buildDrone({
  validator,
  generateIdentifier,
  makeSource,
}: {
    validator: Validator,
    generateIdentifier: () => string,
    makeSource: ({ip, browser, referrer}: SourceModel) => SourceExport
}): ({
  id, source, homeLocation, isBusy, connectedOn,
}: DroneModel) => DroneExport {
  return function makeDrone({
    id = generateIdentifier(),
    source,
    homeLocation,
    isBusy = false,
    connectedOn = Date.now(),
  }: DroneModel): DroneExport {
    // Internal parameters
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
      getId: (): string => id,
      getSource: (): SourceExport => validSource,
      getHomeLocation: (): LocationExport => Object.freeze({
        getLatitude: (): number => homeLocation.latitude,
        getLongitude: (): number => homeLocation.longitude,
      }),
      getIsBusy: (): boolean => isBusy,
      getConnectedOn: (): number => connectedOn,
      markAsBusy: (): boolean => isBusy = true,
      markAsNotBusy: (): boolean => isBusy = false,
    });
  };
}
