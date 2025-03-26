import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import Card from './card.js'

export default class Deck extends BaseModel {
  // Table associée
  public static table = 't_deck'

  // Colonnes autorisées pour l'assignation de masse
  @column({ isPrimary: true })
  declare id_deck: number

  @column()
  declare nom: string

  @column()
  declare description: string

  @column()
  declare id_user: number

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoUpdate: true })
  declare updated_at: DateTime

  // Relation avec le modèle User
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  // Relation avec le modèle Card
  @hasMany(() => Card)
  declare cards: HasMany<typeof Card>
}
