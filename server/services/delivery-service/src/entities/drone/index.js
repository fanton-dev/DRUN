import {v4 as uuidv4} from 'uuid';
import ipRegex from 'ip-regex';
import buildCreateDrone from './drone';
import buildSource from './source';
import validator from '../validator';

const makeSource = buildSource(isValidIp);
const createDrone = buildCreateDrone(validator, uuidv4, makeSource);

export default createDrone;

/**
 * Validates request IP and browser information.
 *
 * @param {string} ip - ip address
 * @return {*}
 */
function isValidIp(ip) {
  return ipRegex({exact: true}).test(ip);
}
