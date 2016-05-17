'use strict'

// Leaderboard Message
// https://github.com/ClitherProject/Slither.io-Protocol/blob/master/Protocol.md#type_l_detail

// deflate the message
export function deflate(packet) {
  const gameRank = packet.read()
  const myRank = packet.readInt16()
  const snakeCount = packet.readInt16()
  const snakes = []

  // 10 top players?
  for(var i = 0; i < 10; i++) {
    // TODO: snake length calculation
    const j = packet.readInt16()
    const i = packet.readInt24()
    const font = packet.read()
    const nameLength = packet.read()
    const name = packet.readString(nameLength)
    snakes.push({
      font,
      name
    })
  }


  return {
    gameRank,
    myRank,
    snakeCount,
    snakes
  }
}
