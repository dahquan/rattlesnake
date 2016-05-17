'use strict'

// Add/Remove Snake Message
// https://github.com/ClitherProject/Slither.io-Protocol/blob/master/Protocol.md#type_s_detail

// deflate the message
export function deflate(packet) {
  const id = packet.readInt16()
  
  // Remove snake
  if(packet.size() === 6) {
    const reason = packet.read()

    return {
      removing: true,
      id,
      reason
    }
  }

  const stop = packet.readInt24()
  const unused = packet.read()
  const angle = packet.readInt24()
  const speed = packet.readInt16()
  const unknown = packet.readInt24()
  const skin = packet.read()
  const x = packet.readInt24()
  const y = packet.readInt24()
  const nameLength = packet.read()
  const name = packet.readString(nameLength)

  // Ignoring rest of message for now

  return {
    id,
    stop,
    unused,
    angle,
    speed,
    unknown,
    skin,
    x,
    y,
    name
  }
}
