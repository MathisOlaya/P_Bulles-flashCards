import type { HttpContext } from '@adonisjs/core/http'

//Models
import User from '#models/user'

//Import Validator
import { loginUserValidator } from '#validators/auth'
import { registerUserValidator } from '#validators/register'

export default class AuthController {
  async logInIndex({ view, response, auth }: HttpContext) {
    return view.render('pages/auth/login')
  }
  async registerIndex({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }
  async login({ request, auth, session, response }: HttpContext) {
    const { username, password } = await request.validateUsing(loginUserValidator)

    const user = await User.verifyCredentials(username, password)

    await auth.use('web').login(user)

    return response.redirect().toRoute('home')
  }
  async register({ request }: HttpContext) {
    const { username, password, confirmPassword } =
      await request.validateUsing(registerUserValidator)
  }
  async logout({ response, auth }: HttpContext) {
    await auth.use('web').logout()

    return response.redirect().toRoute('auth.show')
  }
}
