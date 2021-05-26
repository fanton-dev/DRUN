import {UserExport, Validator} from '@core/@types/entity-exports';
import {UserModel} from '@core/@types/models';


/**
 * User entity containing a identifier, token and a phone number.
 *
 * @export
 * @param {{
 *   validator: Validator,
 *   generateIdentifier: Function,
 *   generateToken: Function,
 * }} {
 *   validator,
 *   generateIdentifier,
 *   generateToken,
 * } - dependency injection
 * @return {Function}
 */
export default function buildUser({
  validator,
  generateIdentifier,
  generateToken,
}: {
  validator: Validator;
  generateIdentifier: () => string;
  generateToken: () => string;
}): ({id, token, phoneNumber}: UserModel) => UserExport {
  return function makeOrder({
    id = generateIdentifier(),
    token = generateToken(),
    phoneNumber,
  }: UserModel): UserExport {
    // TO-DO data validation

    // Module exporting
    return Object.freeze({
      getId: () => id,
      getToken: () => token,
      getPhoneNumber: () => phoneNumber,
    });
  };
};
