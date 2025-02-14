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

// [Routes] : Default
router.on('/').redirect('/home').use(middleware.auth())

// [Authentification] : Login
router.on('/login').render('pages/auth/login').as('auth.login.show').use(middleware.guest()) //Show form login
router.post('/login', [AuthController, 'login']).as('auth.login').use(middleware.guest()) //Treat from login

// [Authentification] : Register
router
  .on('/register')
  .render('pages/auth/register')
  .as('auth.register.show')
  .use(middleware.guest())
router.post('/register', [AuthController, 'register']).as('auth.register')

// [Authentification] : Logout
router.get('/logout', [AuthController, 'logout']).as('auth.logout').use(middleware.auth())

// [Home page]
router.get('/home', [DecksController, 'index']).as('home').use(middleware.auth())

// [Deck]
router
  .on('/deck/create')
  .render('pages/deck/createDeck')
  .as('deck.create.show')
  .use(middleware.auth())
router.post('/deck/create', [DecksController, 'create']).as('deck.create').use(middleware.auth())

// Show deck's page
router.get('/deck/:id/show', [DecksController, 'show']).as('deck.show').use(middleware.auth())

//Delete deck
router.delete('/deck/:id/delete', [DecksController, 'delete']).as('deck.delete').use(middleware.auth())
