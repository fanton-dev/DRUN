import {Knex} from 'knex';

const up = function(knex: Knex) {
  return knex.schema.createTable('person', (table) => {
    table.uuid('id').primary();
    table.string('phoneNumber').notNullable().unique();
    table.string('token').notNullable();
    table.timestamps(true, true);
  });
};

const down = function(knex: Knex) {
  return knex.schema.dropTable('users');
};

export {up, down};
