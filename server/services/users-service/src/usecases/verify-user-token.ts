import User from 'src/database/entities/user';
import {Repository} from 'typeorm';

/**
 * Verifies whether a token submitted is the valid for the given user.
 *
 * @export
 * @param {{
 *   getUsersRepository: Function;
 * }} {
 *   getUsersRepository,
 * } - dependency injection
 * @return {Function}
 */
export default function buildVerifyUserToken({
  getUsersRepository,
}: {
  getUsersRepository(): Repository<User>;
}): Function {
  return async function verifyUserToken(
      userId: string,
      token: string,
  ): Promise<boolean> {
    return await getUsersRepository().find({
      id: userId,
      token: token,
    }) !== undefined;
  };
}
