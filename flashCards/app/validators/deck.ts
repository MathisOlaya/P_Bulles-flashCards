import vine from '@vinejs/vine'

const createDeckValidator = vine.compile(
  vine.object({
    name: vine.string().unique(async (db, value, field) => {
      console.log(field)
      const user = await db.from('t_deck').where('nom', value).first()
      return !user
    }),
    description: vine.string().minLength(10),
  })
)

const updateDeckValidator = vine.compile(
  vine.object({
    name: vine.string().unique(async (db, value, field) => {
      console.log(field)
      const user = await db.from('t_deck').where('nom', value).andWhereNot('id_deck', field.parent.params.id).first()
      return !user
    }),
    description: vine.string().minLength(10),
  })
)

export { createDeckValidator, updateDeckValidator }
