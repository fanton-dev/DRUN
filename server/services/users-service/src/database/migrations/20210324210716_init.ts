import {Knex} from 'knex';

const up = function(knex: Knex) {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary();
    table.string('phone_number').notNullable().unique();
    table.string('token').notNullable();
    table.timestamps(true, true);
  });
};

const down = function(knex: Knex) {
  return knex.schema.dropTable('users');
};

export {up, down};
