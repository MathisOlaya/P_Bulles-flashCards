import type { HttpContext } from '@adonisjs/core/http'

//Models
import User from '#models/user'

//Import Validator
import { loginUserValidator } from '#validators/auth'
import { registerUserValidator } from '#validators/auth'

export default class AuthController {
  async login({ request, auth, session, response }: HttpContext) {
    const { username, pwd } = await request.validateUsing(loginUserValidator)

    const user = await User.verifyCredentials(username, pwd)

    await auth.use('web').login(user)

    return response.redirect().toRoute('home')
  }
  async register({ request, auth, response }: HttpContext) {
    const { username, pwd, confirmPassword } = await request.validateUsing(registerUserValidator)

    const user = await User.create({
      username: username,
      password_hash: pwd,
    })

    await auth.use('web').login(user)

    return response.redirect().toRoute('home')
  }
  async logout({ response, auth }: HttpContext) {
    await auth.use('web').logout()

    return response.redirect().toRoute('auth.login.show')
  }
}
