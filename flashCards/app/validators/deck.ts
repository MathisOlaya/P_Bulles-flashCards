import vine from '@vinejs/vine'

const createDeckValidator = (userId: number) => {
  return vine.compile(
    vine.object({
      name: vine.string().unique(async (db, value, field) => {
        console.log(field.meta)
        const user = await db.from('t_deck').where('nom', value).andWhere('id_user', userId).first()
        return !user
      }),
      description: vine.string().trim().minLength(10),
    })
  )
}

const updateDeckValidator = (userId: number) => {
  return vine.compile(
    vine.object({
      name: vine.string().unique(async (db, value, field) => {
        const user = await db
          .from('t_deck')
          .where('nom', value)
          .andWhereNot('id_deck', field.parent.params.id)
          .andWhere('id_user', userId)
          .first()
        return !user
      }),
      description: vine.string().trim().minLength(10),
    })
  )
}

export { createDeckValidator, updateDeckValidator }
