import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
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
  public id_user: number

  @column()
  public username: string

  @column()
  public password_hash: string

  @column()
  public isAdmin: boolean

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoUpdate: true })
  public updated_at: DateTime

  // Relation avec le modèle Deck
  @hasMany(() => Deck)
  public decks: HasMany<typeof Deck>
}
