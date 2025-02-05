import type { HttpContext } from '@adonisjs/core/http'

//models
import Deck from '#models/deck'

export default class DecksController {
  async index({ view, auth }: HttpContext) {
    //get how many decks he has
    const decks = await Deck.query()
    const deckCount = decks.length

    return view.render('pages/home', { deckCount })
  }
}
