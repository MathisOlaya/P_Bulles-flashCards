import type { HttpContext } from '@adonisjs/core/http'

//Models
import User from '#models/user'

//Import Validator
import { loginUserValidator } from '#validators/auth'

export default class AuthController {
  async index({ view, response, auth }: HttpContext) {
    if (await auth.check()) {
      response.redirect().toRoute('home')
    }
    return view.render('pages/auth/login')
  }
  async login({ request, auth, session, response }: HttpContext) {
    const { username, password } = await request.validateUsing(loginUserValidator)

    const user = await User.verifyCredentials(username, password)

    await auth.use('web').login(user)

    return response.redirect().toRoute('home')
  }
  async logout({ response, auth }: HttpContext) {
    await auth.use('web').logout()

    return response.redirect().toRoute('auth.show')
  }
}
