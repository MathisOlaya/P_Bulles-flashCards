import type { HttpContext } from '@adonisjs/core/http'

//models
import Deck from '#models/deck'

export default class DecksController {
  async index({ view }: HttpContext) {
    const deckCount = await Deck.query().count

    return view.render('pages/home', { deckCount })
  }
}
