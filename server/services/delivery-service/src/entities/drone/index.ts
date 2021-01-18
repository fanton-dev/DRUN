import {v4 as uuidv4} from 'uuid';
import ipRegex from 'ip-regex';
import buildCreateDrone from './drone';
import buildSource from '../../../../core/entities/source';
import validator from '../../../../core/entities/validator';

const makeSource = buildSource({isValidIp});
const createDrone = buildCreateDrone({
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

export default createDrone;

