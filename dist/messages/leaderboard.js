'use strict';

// Leaderboard Message
// https://github.com/ClitherProject/Slither.io-Protocol/blob/master/Protocol.md#type_l_detail

// deflate the message

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deflate = deflate;
function deflate(packet) {
  var gameRank = packet.read();
  var myRank = packet.readInt16();
  var snakeCount = packet.readInt16();
  var snakes = [];

  // 10 top players?
  for (var i = 0; i < 10; i++) {
    // TODO: snake length calculation
    var j = packet.readInt16();
    var _i = packet.readInt24();
    var font = packet.read();
    var nameLength = packet.read();
    var name = packet.readString(nameLength);
    snakes.push({
      font: font,
      name: name
    });
  }

  return {
    gameRank: gameRank,
    myRank: myRank,
    snakeCount: snakeCount,
    snakes: snakes
  };
}