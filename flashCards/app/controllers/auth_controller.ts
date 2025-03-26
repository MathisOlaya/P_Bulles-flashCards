import type { HttpContext } from '@adonisjs/core/http'

//Models
import User from '#models/user'

//Import Validator
import { loginUserValidator } from '#validators/auth'
import { registerUserValidator } from '#validators/auth'

export default class AuthController {
  async login({ request, auth, session, response }: HttpContext) {
    const { username, pwd } = await request.validateUsing(loginUserValidator)

    let user

    try {
      user = await User.verifyCredentials(username, pwd)
    } catch {
      if (!user) {
        // Si l'utilisateur n'existe pas ou que le mot de passe est incorrect
        session.flash('error', 'Mot de passe incorrect.')
        return response.redirect().toRoute('auth.login.show')
      }
    }

    await auth.use('web').login(user)

    return response.redirect().toRoute('home')
  }
  async register({ request, auth, response }: HttpContext) {
    const { username, pwd } = await request.validateUsing(registerUserValidator)

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
