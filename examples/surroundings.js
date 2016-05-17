'use strict'

// ========
// Surroundings Example
//
// This example will print out snakes that come in and out of the view.
//

const Bot = require('../dist')

const bot = new Bot({
  name: process.env.SLITHER_SERVER_NAME || 'RattleSnake',
  // logLevel: 'debug',
  server: process.env.SLITHER_SERVER || '199.21.79.246:444'
})

// Listen for new snakes
bot.on('snakeEnter', function(snake, me) {
  console.log(snake.name + ' is now near you ' + (me ? '(Me)' : ''))
})

// Leaving snakes
bot.on('snakeLeft', function(snake, me) {
  const reason = (snake.reason === 1 ? 'Died' : 'Left')
  console.log(snake.name + ' Just left the view (' + reason + ')')
})

// Did we die?
bot.once('dead', function(message) {
  console.log('R.I.P you died')
  console.log('Highscore: ' + (message.isHighscore ? 'Yes': 'No'))
})

// Disconnect
bot.once('disconnected', function() {
  console.log('Disconnected')
})

// Print any errors
bot.once('error', function(error) {
  console.log('Error: ' + error)
})

// Connect the bot
bot.connect()
