import type { HttpContext } from '@adonisjs/core/http'

// [Models]
import Deck from '#models/deck'
import Card from '#models/card'

// [Validator]
import { createDeckValidator, updateDeckValidator } from '#validators/deck'
import { request } from 'http'

export default class DecksController {
  async index({ view, auth, request }: HttpContext) {
    // Get query parameter
    const query = request.input('q')

    //get user
    const user = await auth.getUserOrFail()

    //get how many decks he has
    let decks = await Deck.query().where('id_user', user.id_user)
    const deckCount = decks.length
    // If user specify QUERY.
    if (query) {
      decks = await Deck.query().where('id_user', user.id_user).andWhereILike('nom', `%${query}%`)
    }

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

    if (!deck) {
      return view.render('pages/errors/not_found')
    }

    //change date format
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

    // Get all cards from deck
    const cards = await Card.query().where('id_deck', deckId)

    return view.render('pages/deck/showDeck', { deck, cards })
  }
  async create({ request, auth, response, session }: HttpContext) {
    //get user
    const user = await auth.getUserOrFail()

    //valide data
    const { name, description } = await request.validateUsing(createDeckValidator(user.id_user))

    await Deck.create({
      nom: name,
      description: description,
      id_user: user.id_user,
    })

    session.flash('success', 'Deck crée avec succès')

    return response.redirect().toRoute('home')
  }
  async delete({ request, view, auth, response, session }: HttpContext) {
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

    await deckToDelete.delete()

    session.flash('success', 'Deck supprimé avec succès')

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
  async update({ view, response, request, auth, session }: HttpContext) {
    const user = await auth.getUserOrFail()

    const { name, description } = await request.validateUsing(updateDeckValidator(user.id_user))

    const deckId = await request.param('id')

    const deck = await Deck.query()
      .where('id_deck', deckId)
      .andWhere('id_user', user.id_user)
      .first()

    if (!deck) {
      return view.render('pages/errors/not_found')
    }

    deck
      .merge({
        nom: name,
        description: description,
      })
      .save()

    session.flash('success', 'Deck modifié avec succès')

    return response.redirect().toRoute('home')
  }

  async selectGame({ view, request, auth }: HttpContext) {
    const id = request.param('id')
    const user = await auth.getUserOrFail()

    const deck = await Deck.query().where('id_deck', id).andWhere('id_user', user.id_user).first()

    if (!deck) {
      return view.render('pages/errors/not_found')
    }

    // How many cards has this deck ?
    const cards = await Card.query().where('id_deck', id)
    const cardsCount = cards.length

    return view.render('pages/game/gameselector', { deck, cardsCount })
  }
  async play({ view, request, auth }: HttpContext) {
    // Get game mode
    const { gamemode } = request.all()

    // Deck ID
    const id = request.param('id')

    // User
    const user = await auth.getUserOrFail()

    // Get DECK
    const deck = await Deck.query().where('id_deck', id).andWhere('id_user', user.id_user).first()

    if (!deck) {
      return view.render('pages/errors/not_found')
    }

    // Get cards
    const cards = await Card.query().where('id_deck', id)

    return view.render('pages/game/game', {
      deck,
      cards: JSON.stringify(
        cards.map((card) => {
          card.reponse = encodeURIComponent(card.reponse) // Encoder les réponses
          return card
        })
      ),
    })
  }

  async victory({ view, request, auth }: HttpContext) {
    // Deck ID
    const id = request.param('id')

    // User
    const user = await auth.getUserOrFail()

    // Get DECK
    const deck = await Deck.query().where('id_deck', id).andWhere('id_user', user.id_user).first()

    if (!deck) {
      return view.render('pages/errors/not_found')
    }

    return view.render('pages/game/victory', { deck })
  }
}
