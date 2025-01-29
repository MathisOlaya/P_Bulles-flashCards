/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

//controller
import DecksController from '#controllers/decks_controller'

//routes
router.get('/', [DecksController, 'index']).as('home')
