import { BaseSchema } from '@adonisjs/lucid/schema'

export default class TCardSchema extends BaseSchema {
  protected tableName = 't_card'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_card').notNullable() // Clé primaire
      table.string('question', 70).notNullable().unique() // Question unique
      table.string('reponse', 70).notNullable() // Réponse
      table.integer('id_deck').unsigned().notNullable() // Clé étrangère vers t_deck
      table.foreign('id_deck').references('t_deck.id_deck').onDelete('CASCADE')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
