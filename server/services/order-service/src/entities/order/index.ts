import {v4 as uuidv4} from 'uuid';
import ipRegex from 'ip-regex';
import buildMakeOrder from './order';
import validator from '../../../../core/entities/validator';
import buildSource from '../../../../core/entities/source';
import decompressOrder from './order-decompress';

const makeSource = buildSource({isValidIp});
const makeOrder = buildMakeOrder({
  validator: validator,
  generateIdentifier: uuidv4,
  makeSource: makeSource,
});

/**
 * Validates request IP and browser information.
 *
 * @param {string} ip - ip address
 * @return {boolean}
 */
function isValidIp(ip: string): boolean {
  return ipRegex({exact: true}).test(ip);
}

export default makeOrder;
export {decompressOrder};
