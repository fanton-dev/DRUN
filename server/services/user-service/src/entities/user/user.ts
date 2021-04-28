import {User, UserExport, Validator} from '../../../../core/@types/global';

/**
 * User entity containing a identifier, token and a phone number.
 *
 * @export
 * @param {{
 *   validator: Validator,
 *   generateIdentifier: Function,
 * }} {
 *   validator,
 *   generateIdentifier,
 * }
 * @return {Function} - user object builder
 */
export default function buildMakeUser({
  validator,
  generateIdentifier,
  generateToken,
}: {
  validator: Validator;
  generateIdentifier: () => string;
  generateToken: () => string;
}): Function {
  return function makeOrder({
    id = generateIdentifier(),
    token = generateToken(),
    phoneNumber,
  }: User): UserExport {
    // TO-DO data validation

    // Module exporting
    return Object.freeze({
      getId: () => id,
      getToken: () => token,
      getPhoneNumber: () => phoneNumber,
    });
  };
};
