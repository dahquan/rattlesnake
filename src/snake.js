'use strict'

import Packet from './lib/packet'

class Snake {
  constructor(bot, message) {
    this.bot = bot

    // TODO: Is there a better way to do this?
    Object.assign(this, message)
  }

  // distanceToPoint
  distanceToPoint() {
  }

  // distanceToSnake
  distanceToSnake() {
  }

  // facePosition will change the angle of the snake so it goes towards x,y
  facePosition(x, y) {
    // UpdateOwnSnake
    // https://github.com/ClitherProject/Slither.io-Protocol/blob/master/Protocol.md#packet-updateownsnake

    const radians = Math.atan2(y - this.y, x - this.x)
    const packet = new Packet(1)
    packet.put(Math.ceil(radians / (Math.PI / 125)))
    packet.send(this.bot.conn)
  }

  // toggleSpeeding will toggle snake speeding
  toggleSpeeding(on) {
    const packet = new Packet(1)
    packet.put(on ? 253 : 254)
    packet.send(this.bot.conn)
  }
}

export default Snake
