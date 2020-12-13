/**
 * Validator entity, providing the means for testing passed identifier,
 * location and payment data.
 *
 * @export
 * @param {Object} uuidValidate - uuid validator dependency injection
 * @return {function} - validator object builder
 */
export default function buildValidator(uuidValidate) {
  /**
   * Validates whether an id string is in a valid format or not
   *
   * @param {string} identifier - id (identifier)
   * @param {string} type - either 'internal' or 'firebase'
   * @return {void}
   */
  function validateIdentifier(identifier, type) {
    if (!identifier) {
      throw new Error('Identifier not defined.');
    }

    if (type !== 'internal' && type !== 'firebase') {
      throw new Error('Identifier type defined is invalid.');
    }

    if (type === 'internal' && !uuidValidate(identifier)) {
      throw new Error('Identifier passed is invalid.');
    }

    if (type === 'firebase' && !identifier.match(/^[0-9a-zA-Z]+$/)) {
      throw new Error('Identifier passed is invalid.');
    }
  }

  /**
   * Validates whether a location object is in a valid format or not.
   *
   * @param {{latitude: number, longitude: number}} location
   * @return {void}
   */
  function validateLocation(location) {
    if (!location) {
      throw new Error('Location not defined.');
    }

    if (!location.latitude) {
      throw new Error('Location must have a latitude defined.');
    }

    if (!location.longitude) {
      throw new Error('Location must have a longitude defined.');
    }

    if (Number.isNaN(Number(location.latitude))) {
      throw new Error('Location latitude must be a number.');
    }

    if (Number.isNaN(Number(location.longitude))) {
      throw new Error('Location longitude must be a number.');
    }

    if (location.latitude < -90.0 || location.latitude > 90.0) {
      throw new Error('Latitude must be between -90 and 90.');
    }

    if (location.longitude < -180.0 || location.longitude > 180.0) {
      throw new Error('Longitude must be between -180 and 180.');
    }
  }

  /**
   * Validates whether a route can be completed by a drone.
   *
   * @param {{latitude: number, longitude: number}} homeLocation
   * @param {{latitude: number, longitude: number}} senderLocation
   * @param {{latitude: number, longitude: number}} receiverLocation
   * @param {number} maxDistance - max flight distance in kilometers
   * @return {number} totalDistance - the flight distance
   */
  function validateRoute(
      homeLocation,
      senderLocation,
      receiverLocation,
      maxDistance,
  ) {
    // Home location validation
    try {
      validateLocation(homeLocation);
    } catch (err) {
      throw new Error('Home location error: ' + err.message);
    }

    // Sender location validation
    try {
      validateLocation(senderLocation);
    } catch (err) {
      throw new Error('Sender location error: ' + err.message);
    }

    // Receiver location validation
    try {
      validateLocation(receiverLocation);
    } catch (err) {
      throw new Error('Receiver location error: ' + err.message);
    }

    // Calculating total distance of flight
    let totalDistance;
    totalDistance = calculateDistance(homeLocation, senderLocation);
    totalDistance += calculateDistance(senderLocation, receiverLocation);
    totalDistance += calculateDistance(receiverLocation, homeLocation);

    // Flight distance validation
    if (totalDistance > maxDistance) {
      throw new Error('Flight distance too long.');
    }

    return totalDistance;

    /**
     * Calculates distance in kilometers between two geographical points using
     * the Haversine formula (ref: https://en.wikipedia.org/wiki/Haversine_formula)
     *
     * @param {{latitude: number, longitude: number}} locationA
     * @param {{latitude: number, longitude: number}} locationB
     * @return {number} - distance between points in kilometers
     */
    function calculateDistance(locationA, locationB) {
      const R = 6371; // 1 kilometer
      const toRad = (value) => value * Math.PI / 180;

      const dLatitude = toRad(locationB.latitude - locationA.latitude);
      const dLongitude = toRad(locationB.longitude - locationA.longitude);
      const LatitudeA = toRad(locationA.latitude);
      const LatitudeB = toRad(locationB.latitude);

      const a = Math.pow(Math.sin(dLatitude / 2), 2) +
        Math.pow(Math.sin(dLongitude / 2), 2) *
        Math.cos(LatitudeA) * Math.cos(LatitudeB);

      let result = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      result *= R;

      return result;
    }
  }

  // Module exporting
  return Object.freeze({
    validateIdentifier: validateIdentifier,
    validateLocation: validateLocation,
    validateRoute: validateRoute,
  });
}
