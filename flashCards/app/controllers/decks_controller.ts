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
  async show({ request, view, auth }: HttpContext) {
    //check if the parameter's id is a deck of current user
    const user = await auth.getUserOrFail();
    const deckId = await request.param('id');

    const deck = await Deck.query().where('id_deck', deckId).andWhere('id_user', user.id_user).first()

    if(!deck){
      return view.render('pages/errors/not_found')
    }

    return view.render('pages/deck/showDeck', { deck })
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
  async delete({request}: HttpContext){
    console.log("DELETE")
  }
}
