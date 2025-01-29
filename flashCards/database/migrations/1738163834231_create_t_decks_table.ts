import { BaseSchema } from '@adonisjs/lucid/schema'

export default class TDeckSchema extends BaseSchema {
  protected tableName = 't_deck'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_deck').notNullable() // Clé primaire
      table.string('nom', 70).notNullable().unique() // Nom unique
      table.string('description', 254).notNullable() // Description
      table.integer('id_user').unsigned().notNullable() // Clé étrangère vers t_user
      table.foreign('id_user').references('t_user.id_user').onDelete('CASCADE')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
