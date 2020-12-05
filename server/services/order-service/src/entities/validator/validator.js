/**
 * Validator entity, providing the means for testing passed identifier,
 * location and payment data.
 *
 * @export
 * @param {Object} uuidValidate - uuid validator dependency injection
 * @param {Object} moment - moment dependency injection
 * @return {Function} - validator object builder
 */
export default function buildValidator(uuidValidate, moment) {
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
   * Validates whether a paymentCard object is in a valid format or not.
   *
   * @param {{number: number, date: string, CVC: number}} paymentCard
   * @return {void}
   */
  function validatePaymentCard(paymentCard) {
    if (!paymentCard) {
      throw new Error('Card not defined.');
    }

    if (!paymentCard.number) {
      throw new Error('Card must have a number defined.');
    }

    if (!paymentCard.date) {
      throw new Error('Card must have a date defined.');
    }

    if (!paymentCard.CVC) {
      throw new Error('Card must have a CVC defined.');
    }

    if (!paymentCard.number.match(/^[0-9 ]+$/)) {
      throw new Error('Card number can only have numbers.');
    }

    if (paymentCard.number.replace(/ /g, '').length !== 16) {
      throw new Error('Card number must contain 16 digits.');
    }

    if (!moment(paymentCard.date, 'MM/YY', true).isValid()) {
      throw new Error('Card date must be in MM/YY format.');
    }

    if (moment(paymentCard.date, 'MM/YY', true).diff(moment()) < 0) {
      throw new Error('Card date must not have expired.');
    }

    if (!paymentCard.CVC.match(/^[0-9]+$/)) {
      throw new Error('Card CVC can only contain numbers.');
    }

    if (paymentCard.CVC.length !== 3) {
      throw new Error('Card CVC must contain 3 digits.');
    }
  }

  // Module exporting
  return Object.freeze({
    validateIdentifier: validateIdentifier,
    validateLocation: validateLocation,
    validatePaymentCard: validatePaymentCard,
  });
}
