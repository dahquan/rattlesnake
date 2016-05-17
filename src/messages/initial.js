'use strict'

// Initial Setup Message
// https://github.com/ClitherProject/Slither.io-Protocol/blob/master/Protocol.md#type_a_detail

// deflate the message
export function deflate(packet) {
  const gameRadius = packet.readInt24()
  const mscps = packet.readInt16()
  const sectorSize = packet.readInt16()
  const sectorCountAlongEdge = packet.readInt16()
  const spangdv = packet.read()
  const nsp1 = packet.readInt16()
  const nsp2 = packet.readInt16()
  const nsp3 = packet.readInt16()
  const mamu = packet.readInt16()
  const manu2 = packet.readInt16()
  const cst = packet.readInt16()
  const protocolVersion = packet.read()

  return {
    gameRadius,
    mscps,
    sectorSize,
    sectorCountAlongEdge,
    spangdv,
    nsp1,
    nsp2,
    nsp3,
    mamu,
    manu2,
    cst,
    protocolVersion
  }
}
