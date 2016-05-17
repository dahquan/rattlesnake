'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _packet = require('./lib/packet');

var _packet2 = _interopRequireDefault(_packet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Snake = function () {
  function Snake(bot, message) {
    _classCallCheck(this, Snake);

    this.bot = bot;

    // TODO: Is there a better way to do this?
    Object.assign(this, message);
  }

  // distanceToPoint


  _createClass(Snake, [{
    key: 'distanceToPoint',
    value: function distanceToPoint() {}

    // distanceToSnake

  }, {
    key: 'distanceToSnake',
    value: function distanceToSnake() {}

    // facePosition will change the angle of the snake so it goes towards x,y

  }, {
    key: 'facePosition',
    value: function facePosition(x, y) {
      // UpdateOwnSnake
      // https://github.com/ClitherProject/Slither.io-Protocol/blob/master/Protocol.md#packet-updateownsnake

      var radians = Math.atan2(y - this.y, x - this.x);
      var packet = new _packet2.default(1);
      packet.put(Math.ceil(radians / (Math.PI / 125)));
      packet.send(this.bot.conn);
    }

    // toggleSpeeding will toggle snake speeding

  }, {
    key: 'toggleSpeeding',
    value: function toggleSpeeding(on) {
      var packet = new _packet2.default(1);
      packet.put(on ? 253 : 254);
      packet.send(this.bot.conn);
    }
  }]);

  return Snake;
}();

exports.default = Snake;
module.exports = exports['default'];