import {MigrationInterface, QueryRunner, Table, TableIndex} from 'typeorm';

/**
 * Users database migration instance.
 *
 * @export
 * @class Users1614041101728
 * @implements {MigrationInterface}
 */
export class Users1614041101728 implements MigrationInterface {
  /**
   * Performs database migration.
   *
   * @param {QueryRunner} queryRunner
   * @return {Promise<void>}
   * @memberof Users1614041101728
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
        new Table({
          columns: [
            {
              name: 'id',
              isPrimary: true,
              type: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'phoneNumber',
              type: 'varchar',
              length: '15',
            },
            {
              name: 'token',
              type: 'varchar',
              length: '64',
            },
            {
              name: 'createdAt',
              type: 'timestamptz',
              default: 'now()',
            },
          ],
          name: 'users',
        }),
    );

    await queryRunner.createIndex(
        'users',
        new TableIndex({
          columnNames: ['phoneNumber'],
          isUnique: true,
          name: 'unique_phoneNumber',
        }),
    );
  }

  /**
   * Reverts database migration.
   *
   * @param {QueryRunner} queryRunner
   * @return {Promise<void>}
   * @memberof Users1614041101728
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
