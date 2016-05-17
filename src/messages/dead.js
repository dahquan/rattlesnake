'use strict'

// Dead/Disconnect Message
// https://github.com/ClitherProject/Slither.io-Protocol/blob/master/Protocol.md#type_v_detail

// deflate the message
export function deflate(packet) {
  const deathType = packet.read()
  const isHighscore = (deathType === 1)
  const disconnected = (deathType === 2)

  return {
    deathType,
    isHighscore,
    disconnected
  }
}
