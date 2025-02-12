import vine from '@vinejs/vine'

const loginUserValidator = vine.compile(
  vine.object({
    username: vine.string(),
    pwd: vine.string(),
  })
)

const registerUserValidator = vine.compile(
  vine.object({
    username: vine.string().unique(async (db, value) => {
      const user = await db.from('t_user').where('username', value).first()
      return !user
    }),
    pwd: vine.string().minLength(8).confirmed({
      confirmationField: 'confirmPassword',
    }),
    confirmPassword: vine.string(),
  })
)

export { loginUserValidator, registerUserValidator }
