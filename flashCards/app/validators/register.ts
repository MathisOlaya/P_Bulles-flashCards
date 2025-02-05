import vine from '@vinejs/vine'

const registerUserValidator = vine.compile(
  vine.object({
    username: vine.string(),
    password: vine.string().minLength(8).confirmed({
      confirmationField: 'confirmPassword',
    }),
  })
)

export { registerUserValidator }
