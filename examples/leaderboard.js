'use strict'

// ========
// Leaderboard Example
//
// This example will get the top players on the leaderboard then disconnect
// * Currently doesn't get the snake length *
//

const Bot = require('../dist')

const bot = new Bot({
  name: process.env.SLITHER_SERVER_NAME || 'RattleSnake',
  // logLevel: 'debug',
  server: process.env.SLITHER_SERVER || '199.21.79.246:444'
})

// Just listen for the leaderboard event then disconnect
bot.once('leaderboard', function(leaderboard) {
  console.log()
  console.log('====== TOP ' + leaderboard.length + ' ======')
  console.log()

  leaderboard.forEach(function(entry, i) {
    console.log('#' + i + '. ' + entry.name)
  })

  bot.close()
})

// Print any errors
bot.on('error', function(error) {
  console.log('Error: ' + error)
})

// Connect the bot
bot.connect()
