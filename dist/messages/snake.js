'use strict';

// Add/Remove Snake Message
// https://github.com/ClitherProject/Slither.io-Protocol/blob/master/Protocol.md#type_s_detail

// deflate the message

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deflate = deflate;
function deflate(packet) {
  var id = packet.readInt16();

  // Remove snake
  if (packet.size() === 6) {
    var reason = packet.read();

    return {
      removing: true,
      id: id,
      reason: reason
    };
  }

  var stop = packet.readInt24();
  var unused = packet.read();
  var angle = packet.readInt24();
  var speed = packet.readInt16();
  var unknown = packet.readInt24();
  var skin = packet.read();
  var x = packet.readInt24();
  var y = packet.readInt24();
  var nameLength = packet.read();
  var name = packet.readString(nameLength);

  // Ignoring rest of message for now

  return {
    id: id,
    stop: stop,
    unused: unused,
    angle: angle,
    speed: speed,
    unknown: unknown,
    skin: skin,
    x: x,
    y: y,
    name: name
  };
}