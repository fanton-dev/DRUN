import ipRegex from 'ip-regex';
import buildSource from './source';

/**
 * Validates request IP and browser information.
 *
 * @param {string} ip - ip address
 * @return {boolean}
 */
function isValidIp(ip: string): boolean {
  return ipRegex({exact: true}).test(ip);
}

const makeSource = buildSource({isValidIp});

export default makeSource;
