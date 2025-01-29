import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import Card from './card.js'

export default class Deck extends BaseModel {
  // Table associée
  public static table = 't_deck'

  // Colonnes autorisées pour l'assignation de masse
  @column({ isPrimary: true })
  public id_deck: number

  @column()
  public nom: string

  @column()
  public description: string

  @column()
  public id_user: number

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoUpdate: true })
  public updated_at: DateTime

  // Relation avec le modèle User
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  // Relation avec le modèle Card
  @hasMany(() => Card)
  public cards: HasMany<typeof Card>
}
