/**
 * Converts an entity export object to normal object.
 *
 * @export
 * @template T - export object type
 * @template U - normalized object type
 * @param {T} object - export object
 * @return {U} - normalized object
 */
export function exportToNormalEntity<T extends Object, U extends Object>(
    object: T,
): U {
  // @ts-ignore ts(2322) - This is so we still get return typing without TS
  // complaining about potential type mismatch.
  return Object.fromEntries(
      Object.entries(object).map((entry) => entry[0].startsWith('get') ? [
        // Converting object key from 'getKeyName' to 'keyName'
        entry[0].replace(/get[A-Z]/, entry[0][3].toLowerCase()),

        // Checking whether there is a nested object within the value. If there
        // is, this function is run on it. Otherwise only the result from the
        // getter is stored.
        typeof entry[1]() === 'object' ? exportToNormalEntity(entry[1]()) :
                                         entry[1](),
      ] : []),
  );
}

const entityUtilities = Object.freeze({
  exportToNormalEntity: exportToNormalEntity,
});

export default entityUtilities;
