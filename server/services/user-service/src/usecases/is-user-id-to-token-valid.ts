import {UserDatabaseController} from '../../../core/@types/global';

/**
 * Verifies whether a token submitted is the valid for the given user.
 *
 * @export
 * @param {{
 *   usersDatabase: UserDatabaseController;
 * }} {
 *   usersDatabase,
 * } - dependency injection
 * @return {Function}
 */
export default function buildIsUserIdToTokenValid({
  usersDatabase,
}: {
  usersDatabase: UserDatabaseController;
}): Function {
  return async function isUserIdToTokenValid(
      userId: string,
      token: string,
  ): Promise<boolean> {
    const user = await usersDatabase.findById(userId)
        .catch(() => null);

    if (!user) return false;
    return user.token === token;
  };
}
