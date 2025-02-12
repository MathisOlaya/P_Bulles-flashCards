import type { HttpContext } from '@adonisjs/core/http'

// [Models]
import Deck from '#models/deck'

// [Validator]
import { createDeckValidator } from '#validators/deck'

export default class DecksController {
  async index({ view, auth }: HttpContext) {
    //get user
    const user = await auth.getUserOrFail()

    //get how many decks he has
    const decks = await Deck.query().where('id_user', user.id_user)
    const deckCount = decks.length

    return view.render('pages/home', { decks, deckCount })
  }
  async show({ view }: HttpContext) {
    return view.render('pages/deck/showDeck')
  }
  async create({ request, auth, response }: HttpContext) {
    const { name, description } = await request.validateUsing(createDeckValidator)

    //get user
    const user = await auth.getUserOrFail()

    await Deck.create({
      nom: name,
      description: description,
      id_user: user.id_user,
    })

    return response.redirect().toRoute('home')
  }
}
