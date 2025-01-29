import type { HttpContext } from '@adonisjs/core/http'

//models
import Deck from '#models/deck'

export default class DecksController {
  async index({ view }: HttpContext) {
    const decks = await Deck.query();
    const deckCount = decks.length

    return view.render('pages/home', { deckCount })
  }
}
