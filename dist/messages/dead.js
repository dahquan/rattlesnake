'use strict';

// Dead/Disconnect Message
// https://github.com/ClitherProject/Slither.io-Protocol/blob/master/Protocol.md#type_v_detail

// deflate the message

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deflate = deflate;
function deflate(packet) {
  var deathType = packet.read();
  var isHighscore = deathType === 1;
  var disconnected = deathType === 2;

  return {
    deathType: deathType,
    isHighscore: isHighscore,
    disconnected: disconnected
  };
}