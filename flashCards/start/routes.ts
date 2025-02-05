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
//[Authentification]
router.on('/').render('pages/home').use(middleware.auth())
router.get('/login', [AuthController, 'index']).as('auth.show').use(middleware.guest())
router.post('/login', [AuthController, 'login']).as('auth.login').use(middleware.guest())

//[Home page]
router.get('/home', [DecksController, 'index']).as('home').use(middleware.auth())
