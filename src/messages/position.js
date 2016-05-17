'use strict'

// Position Message
// https://github.com/ClitherProject/Slither.io-Protocol/blob/master/Protocol.md#type_g_detail

// deflate the message
export function deflate(packet) {
  const id = packet.readInt16()
  const x = packet.readInt16()
  const y = packet.readInt16()

  return {
    id,
    x,
    y
  }
}
