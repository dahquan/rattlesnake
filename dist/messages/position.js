'use strict';

// Position Message
// https://github.com/ClitherProject/Slither.io-Protocol/blob/master/Protocol.md#type_g_detail

// deflate the message

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deflate = deflate;
function deflate(packet) {
  var id = packet.readInt16();
  var x = packet.readInt16();
  var y = packet.readInt16();

  return {
    id: id,
    x: x,
    y: y
  };
}