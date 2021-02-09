import {
  DatabaseClient,
  DatabaseQueryResults,
  UserDatabaseController,
  UserDatabaseSchema,
  User,
} from '../../../../core/@types/global';

/**
 * Database interactions interface.
 *
 * @export
 * @param {({
 *   databaseClient: DatabaseClient,
 *   databaseTable: string
 * })} {
 *   databaseClient,
 *   databaseTable,
 * } - dependency injection
 * @return {UserDatabaseController} - database controller object
 */
export default function makeUsersDatabase({
  databaseClient,
  databaseTable,
}: {
  databaseClient: DatabaseClient,
  databaseTable: string
}): UserDatabaseController {
  /**
   * Finds an entry in the database.
   *
   * @param {string} userId
   * @return {
   *    Promise<User>
   * } - user entry from database
   */
  async function findById(
      userId: string,
  ): Promise<User> {
    const resultRows: void | DatabaseQueryResults<UserDatabaseSchema> = await
    databaseClient.query(`
      SELECT * FROM ${databaseTable} WHERE id = $1
    `, [userId],
    ).catch((e: Error) => console.log(e));

    if (!resultRows) {
      throw new Error('No such user found.');
    }

    const result = resultRows.rows[0];
    return Object.freeze({
      id: result.id,
      token: result.token,
      phoneNumber: result.phone_number,
    });
  }

  /**
   * Inserts an entry in the database.
   *
   * @param {User} {
   *     id,
   *     sender,
   *     receiver,
   *     source,
   *     createdOn,
   *   } - user details
   * @return {{id: string}} - user id
   */
  async function insert({
    id,
    token,
    phoneNumber,
  }: User): Promise<{ id: string }> {
    const resultRows: void | DatabaseQueryResults<UserDatabaseSchema> = await
    databaseClient.query(`
      INSERT INTO ${databaseTable}
      (
        id,
        token,
        phone_number,
      )
      VALUES ($1, $2, $3)
      RETURNING id
    `, [id, token, phoneNumber],
    ).catch((e: Error) => console.log(e));

    if (!resultRows) {
      throw new Error('Error creating user.');
    }

    const result = resultRows.rows[0];
    return {id: result.id};
  }

  return Object.freeze({
    findById: findById,
    insert: insert,
  });
}
