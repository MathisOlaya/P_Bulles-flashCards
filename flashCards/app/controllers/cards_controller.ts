import type { HttpContext } from '@adonisjs/core/http'

// [Models]
import Deck from '#models/deck'
import Card from '#models/card'

// [Validator]
import { createCardValidator, updateCardValidator } from '#validators/card'

export default class CardsController {
  async showCreationPage({ view, auth, request }: HttpContext) {
    // Return correspondant deck from id
    const user = await auth.getUserOrFail()
    const deckId = await request.param('id')

    const deck = await Deck.query()
      .where('id_deck', deckId)
      .andWhere('id_user', user.id_user)
      .first()

    if (!deck) {
      return view.render('pages/errors/not_found')
    }

    return view.render('pages/card/createCard', { deck })
  }

  async createCard({ view, request, auth, response, session }: HttpContext) {
    const user = await auth.getUserOrFail()
    const deckId = await request.param('id')

    const { question, answer } = await request.validateUsing(createCardValidator(deckId))

    // Vérifier que c'est bien un des deck de l'utilisateur qu'on tente de modifier
    const deck = await Deck.query()
      .where('id_deck', deckId)
      .andWhere('id_user', user.id_user)
      .first()

    if (!deck) {
      return view.render('pages/errors/not_found')
    }

    // If ok, create card.
    await Card.create({
      question: question,
      reponse: answer,
      id_deck: deckId,
    })

    session.flash('success', 'Carte créée avec succès.')

    //Redirect to show deck
    return response.redirect().toRoute('deck.show', { id: deckId })
  }

  async showCard({ view, request, auth }: HttpContext) {
    // Get params
    const deckId = await request.param('id')
    const cardId = await request.param('cardId')

    //User
    const user = await auth.getUserOrFail()

    //Vérifier que j'accède bien à une de mes cartes
    //Vérifier que c'est mon deck
    const deck = await Deck.query()
      .where('id_deck', deckId)
      .andWhere('id_user', user.id_user)
      .first()

    if (!deck) {
      return view.render('pages/errors/not_found')
    }

    //Vérifier que la carte existe
    const card = await Card.query()
      .where('id_deck', deck.id_deck)
      .andWhere('id_card', cardId)
      .first()

    if (!card) {
      return view.render('pages/errors/not_found')
    }

    //return card
    return view.render('pages/card/showCard', { card, deck })
  }

  async deleteCard({ view, auth, request, response }: HttpContext) {
    // Get params
    const deckId = await request.param('id')
    const cardId = await request.param('cardId')

    //User
    const user = await auth.getUserOrFail()

    //Vérifier que j'accède bien à une de mes cartes
    //Vérifier que c'est mon deck
    const deck = await Deck.query()
      .where('id_deck', deckId)
      .andWhere('id_user', user.id_user)
      .first()

    if (!deck) {
      return view.render('pages/errors/not_found')
    }

    //Vérifier que la carte existe
    const card = await Card.query()
      .where('id_deck', deck.id_deck)
      .andWhere('id_card', cardId)
      .first()

    if (!card) {
      return view.render('pages/errors/not_found')
    }

    // If ok, delete
    await card.delete()

    return response.redirect().toRoute('deck.show', { id: deckId })
  }

  async showUpdatePage({ view, request, auth }: HttpContext) {
    // Get params
    const deckId = await request.param('id')
    const cardId = await request.param('cardId')

    //User
    const user = await auth.getUserOrFail()

    //Vérifier que j'accède bien à une de mes cartes
    //Vérifier que c'est mon deck
    const deck = await Deck.query()
      .where('id_deck', deckId)
      .andWhere('id_user', user.id_user)
      .first()

    if (!deck) {
      return view.render('pages/errors/not_found')
    }

    //Vérifier que la carte existe
    const card = await Card.query()
      .where('id_deck', deck.id_deck)
      .andWhere('id_card', cardId)
      .first()

    if (!card) {
      return view.render('pages/errors/not_found')
    }

    return view.render('pages/card/updateCard', { deck, card })
  }

  async updateCard({ view, auth, request, response }: HttpContext) {
    //User
    const user = await auth.getUserOrFail()

    // Get params
    const deckId = await request.param('id')
    const cardId = await request.param('cardId')

    const { question, reponse } = await request.validateUsing(updateCardValidator(deckId))

    //Vérifier que j'accède bien à une de mes cartes
    //Vérifier que c'est mon deck
    const deck = await Deck.query()
      .where('id_deck', deckId)
      .andWhere('id_user', user.id_user)
      .first()

    if (!deck) {
      return view.render('pages/errors/not_found')
    }

    //Vérifier que la carte existe
    const card = await Card.query()
      .where('id_deck', deck.id_deck)
      .andWhere('id_card', cardId)
      .first()

    if (!card) {
      return view.render('pages/errors/not_found')
    }

    card
      .merge({
        question: question,
        reponse: reponse,
      })
      .save()

    return response.redirect().toRoute('card.show', { id: deckId, cardId: cardId })
  }
}
