/**
 * Request ip/browser source object.
 *
 * @export
 * @param {*} isValidIp - ip validator dependency injection
 * @return {*}
 */
export default function buildSource(isValidIp) {
  return function makeSource({ip, browser, referrer} = {}) {
    if (!ip) {
      throw new Error('Source must have an IP.');
    }

    if (!isValidIp(ip)) {
      throw new RangeError('Source must have a valid IP.');
    }

    return Object.freeze({
      getIp: () => ip,
      getBrowser: () => browser,
      getReferrer: () => referrer,
    });
  };
}
