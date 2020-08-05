import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("classes_schedules", (table) => {
    table.increments("id").primary();
    table.integer("week_day").notNullable();
    table.integer("from").notNullable();
    table.integer("to").notNullable();

    table
      .integer("class_id")
      .unsigned()
      .references("id")
      .inTable("classes")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("classes_schedules");
}
