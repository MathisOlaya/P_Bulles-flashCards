import vine from '@vinejs/vine'

const createCardValidator = (deckId: number) => {
  return vine.compile(
    vine.object({
      question: vine
        .string()
        .trim()
        .minLength(10)
        .unique(async (db, value) => {
          const user = await db
            .from('t_card')
            .where('question', value)
            .andWhere('id_deck', deckId)
            .first()
          return !user
        }),
      answer: vine.string().trim().minLength(1),
    })
  )
}

const updateCardValidator = (deckId: number) =>
  vine.compile(
    vine.object({
      question: vine
        .string()
        .trim()
        .minLength(10)
        .unique(async (db, value, field) => {
          const user = await db
            .from('t_card')
            .where('question', value)
            .andWhereNot('id_card', field.parent.params.cardId)
            .andWhere('id_deck', deckId)
            .first()
          return !user
        }),
      reponse: vine.string().trim().minLength(1),
    })
  )

export { createCardValidator, updateCardValidator }
