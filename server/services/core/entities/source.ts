import {Source, SourceExport} from '../global';

/**
 * Request ip/browser source object.
 *
 * @export
 * @param {{isValidIp: Function}} {
 *   isValidIp,
 * } - dependency injection
 * @return {Function} - source object builder
 */
export default function buildSource({
  isValidIp,
}: {isValidIp: Function}) {
  return function makeSource({ip, browser, referrer}: Source): SourceExport {
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
