import { BaseSchema } from '@adonisjs/lucid/schema'

export default class TUserSchema extends BaseSchema {
  protected tableName = 't_user'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_user').notNullable() // Clé primaire
      table.string('username', 255).notNullable().unique() // Nom unique
      table.boolean('is_admin').notNullable().defaultTo(false)
      table.string('password_hash', 255).notNullable() // Hash du mot de passe

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
