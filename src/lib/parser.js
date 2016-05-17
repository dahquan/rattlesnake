'use strict'

import Packet from './packet'
import logger from './logger'
import * as messages from '../constants/messages'

const messageMap = {
  [messages.INITIAL]: require('../messages/initial'),
  [messages.POSITION]: require('../messages/position'),
  [messages.EAT]: require('../messages/eat'),
  [messages.LEADERBOARD]: require('../messages/leaderboard'),
  [messages.DEAD]: require('../messages/dead'),
  [messages.SNAKE]: require('../messages/snake'),
}

// Parse a message packet
export function parse(data) {
  const packet = new Packet(data)
  // Ignore the first 2 bytes... at least for now
  packet.readInt16()

  const messageType = packet.read()

  let messageHandler = messageMap[messageType]
  if(typeof messageHandler === 'undefined') {
    // Ignore those for now, they are annoying :^)
    // logger.error('No message handler for message %d', messageType)
    return null
  }

  return Object.assign({
    messageType
  }, messageHandler.deflate(packet))
}
