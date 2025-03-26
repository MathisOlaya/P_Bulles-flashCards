import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Deck from './deck.js'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import hash from '@adonisjs/core/services/hash'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['username'],
  passwordColumnName: 'password_hash',
})

export default class User extends compose(BaseModel, AuthFinder) {
  // Table associée
  public static table = 't_user'

  // Colonnes autorisées pour l'assignation de masse
  @column({ isPrimary: true })
  declare id_user: number

  @column()
  declare username: string

  @column()
  declare password_hash: string

  @column()
  declare isAdmin: boolean

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoUpdate: true })
  declare updated_at: DateTime

  // Relation avec le modèle Deck
  @hasMany(() => Deck)
  declare decks: HasMany<typeof Deck>
}
