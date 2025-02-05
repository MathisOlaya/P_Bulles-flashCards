import { BaseSeeder } from '@adonisjs/lucid/seeders'

import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    User.createMany([
      {
        username: 'Mathis',
        password_hash: 'user',
        isAdmin: true,
      },
      {
        username: 'Eliott',
        password_hash: 'users',
        isAdmin: false,
      },
    ])
  }
}
