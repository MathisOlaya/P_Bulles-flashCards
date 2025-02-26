import type { HttpContext } from '@adonisjs/core/http'

// [Models]
import Deck from '#models/deck'

// [Validator]
import { createDeckValidator, updateDeckValidator } from '#validators/deck'

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
    const user = await auth.getUserOrFail()
    const deckId = await request.param('id')

    const deck = await Deck.query()
      .where('id_deck', deckId)
      .andWhere('id_user', user.id_user)
      .first()

    //change date format
    if (deck) {
      const date = new Date(deck.created_at)
      deck.created_at = date.toLocaleString('fr-FR', {
        weekday: 'long', // Jour de la semaine complet
        year: 'numeric', // Année en format numérique
        month: 'long', // Mois complet
        day: 'numeric', // Jour du mois
        hour: 'numeric', // Heure
        minute: 'numeric', // Minute
        second: 'numeric', // Seconde
        timeZoneName: 'short', // Indication du fuseau horaire
      })
    }

    if (!deck) {
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
  async delete({ request, view, auth, response }: HttpContext) {
    //id who will be delete
    const id = request.param('id')
    const user = await auth.getUserOrFail()

    //On vérifie bien que ce soit un deck de l'utilisateur.
    const deckToDelete = await Deck.query()
      .where('id_deck', id)
      .andWhere('id_user', user.id_user)
      .first()

    if (!deckToDelete) {
      return view.render('pages/errors/not_found')
    }

    deckToDelete.delete()

    response.redirect().toRoute('home')
  }
  async showUpdate({ view, auth, request }: HttpContext) {
    //check if the parameter's id is a deck of current user
    const user = await auth.getUserOrFail()
    const deckId = await request.param('id')

    const deck = await Deck.query()
      .where('id_deck', deckId)
      .andWhere('id_user', user.id_user)
      .first()

    if (!deck) {
      return view.render('pages/errors/not_found')
    }

    return view.render('pages/deck/update', { deck })
  }
  async update({ response, request }: HttpContext) {
    const { name, description } = await request.validateUsing(updateDeckValidator)

    const id = request.param('id')

    //update models
    const deck = await Deck.findOrFail(id)

    deck
      .merge({
        nom: name,
        description: description,
      })
      .save()

    return response.redirect().toRoute('home')
  }
}
