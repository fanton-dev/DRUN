import {Knex} from 'knex';

/**
 * Verifies whether a token submitted is the valid for the given user.
 *
 * @export
 * @param {{
 *   database: Knex;
 * }} {
 *   database,
 * } - dependency injection
 * @return {Function}
 */
export default function buildVerifyUserToken({
  database,
}: {
  database: Knex;
}): ({
  userId, token,
}: {userId: string, token: string, }) => Promise<boolean> {
  return async function verifyUserToken({
    userId, token,
  }: {userId: string, token: string, }): Promise<boolean> {
    return await database.where({
      id: userId,
      token: token,
    }) !== undefined;
  };
}
