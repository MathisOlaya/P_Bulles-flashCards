import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
export default class ShareAuthStateMiddleware {
  public async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const { auth, view } = ctx // Extraction de auth et view depuis le contexte
    try {
      // Vérifie si l'utilisateur est authentifié
      const isAuthenticated = await auth.check()
      // Partage la variable dans les vues
      view.share({ isAuthenticated })
    } catch (error) {
      // Gestion d'erreurs éventuelles
      //console.log(error)
      view.share({ isAuthenticated: false })
    }
    // Passe au middleware suivant ou à la logique de la route
    await next()
  }
}
