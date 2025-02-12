/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
//MiddleWare
import router from '@adonisjs/core/services/router'

//controller
import DecksController from '#controllers/decks_controller'
import AuthController from '#controllers/auth_controller'
import { middleware } from './kernel.js'

//routes
router.on('/').render('pages/home').use(middleware.auth())

//[Authentification]
router.get('/login', [AuthController, 'logInIndex']).as('auth.login.show').use(middleware.guest()) //Show form login
router.post('/login', [AuthController, 'login']).as('auth.login').use(middleware.guest()) //Treat from login

router
  .get('/register', [AuthController, 'registerIndex'])
  .as('auth.register.show')
  .use(middleware.guest())
router.post('/register', [AuthController, 'register']).as('auth.register')

router.get('/logout', [AuthController, 'logout']).as('auth.logout').use(middleware.auth())

//[Home page]
router.get('/home', [DecksController, 'index']).as('home').use(middleware.auth())
