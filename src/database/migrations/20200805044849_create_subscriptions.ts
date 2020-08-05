import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("subscriptions", (table) => {
    table.increments("id").primary();
    table.string("created_at").defaultTo(knex.raw("CURRENT_TIMESTAMP")).notNullable();

    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("subscriptions");
}
