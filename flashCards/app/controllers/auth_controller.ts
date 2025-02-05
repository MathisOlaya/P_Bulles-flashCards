import type { HttpContext } from '@adonisjs/core/http'

//Models
import User from '#models/user'

//Import Validator
import { loginUserValidator } from '#validators/auth'

export default class AuthController {
  async index({ view, response, auth }: HttpContext) {
    if (await auth.check()) {
      return response.redirect().toRoute('home')
    }
    return view.render('pages/auth/login')
  }
}
