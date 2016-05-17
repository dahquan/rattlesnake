'use strict';

// Initial Setup Message
// https://github.com/ClitherProject/Slither.io-Protocol/blob/master/Protocol.md#type_a_detail

// deflate the message

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deflate = deflate;
function deflate(packet) {
  var gameRadius = packet.readInt24();
  var mscps = packet.readInt16();
  var sectorSize = packet.readInt16();
  var sectorCountAlongEdge = packet.readInt16();
  var spangdv = packet.read();
  var nsp1 = packet.readInt16();
  var nsp2 = packet.readInt16();
  var nsp3 = packet.readInt16();
  var mamu = packet.readInt16();
  var manu2 = packet.readInt16();
  var cst = packet.readInt16();
  var protocolVersion = packet.read();

  return {
    gameRadius: gameRadius,
    mscps: mscps,
    sectorSize: sectorSize,
    sectorCountAlongEdge: sectorCountAlongEdge,
    spangdv: spangdv,
    nsp1: nsp1,
    nsp2: nsp2,
    nsp3: nsp3,
    mamu: mamu,
    manu2: manu2,
    cst: cst,
    protocolVersion: protocolVersion
  };
}