import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Deck from './deck.js'

export default class Card extends BaseModel {
  // Table associée
  public static table = 't_card'

  // Colonnes autorisées pour l'assignation de masse
  @column({ isPrimary: true })
  public id_card: number

  @column()
  public question: string

  @column()
  public reponse: string

  @column()
  public id_deck: number

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoUpdate: true })
  public updated_at: DateTime

  // Relation avec le modèle Deck
  @belongsTo(() => Deck)
  public deck: BelongsTo<typeof Deck>
}
