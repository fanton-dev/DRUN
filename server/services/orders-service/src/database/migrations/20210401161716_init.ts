import {Knex} from 'knex';

const up = function(knex: Knex) {
  return knex.schema.createTable('orders', (table) => {
    table.uuid('id').primary();
    table.uuid('sender_id').notNullable();
    table.float('sender_location_latitude').notNullable();
    table.float('sender_location_longitude').notNullable();
    table.uuid('receiver_id').notNullable();
    table.float('receiver_location_latitude').notNullable();
    table.float('receiver_location_longitude').notNullable();
    table.string('source_ip');
    table.string('source_browser');
    table.string('source_referrer');
    table.timestamps(true, true);
  });
};

const down = function(knex: Knex) {
  return knex.schema.dropTable('orders');
};

export {up, down};
