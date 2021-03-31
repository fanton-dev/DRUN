import {Knex} from 'knex';

const up = function(knex: Knex) {
  return knex.schema.createTable('order_logs', (table) => {
    table.increments('id').primary();
    table.string('order_id').notNullable();
    table.string('subject').notNullable();
    table.timestamps(true, true);
  });
};

const down = function(knex: Knex) {
  return knex.schema.dropTable('order_logs');
};

export {up, down};
