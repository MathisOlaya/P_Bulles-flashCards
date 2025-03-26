import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Deck from './deck.js'

export default class Card extends BaseModel {
  // Table associée
  public static table = 't_card'

  // Colonnes autorisées pour l'assignation de masse
  @column({ isPrimary: true })
  declare id_card: number

  @column()
  declare question: string

  @column()
  declare reponse: string

  @column()
  declare id_deck: number

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoUpdate: true })
  declare updated_at: DateTime

  // Relation avec le modèle Deck
  @belongsTo(() => Deck)
  declare deck: BelongsTo<typeof Deck>
}
