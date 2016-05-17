'use strict';

// Packet defines an object we are sending or receiving from the server
// https://github.com/iiegor/slither/blob/master/src/utils/message.coffee

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Packet = function () {
  // Argument can be the size of a new packet or an existing array

  function Packet() {
    _classCallCheck(this, Packet);

    var size = void 0;
    if (typeof arguments[0] === 'number') {
      this.array = new Uint8Array(arguments[0]);
    } else {
      this.array = arguments[0];
    }

    this.readPosition = 0;
    this.writePosition = 0;
  }

  // size


  _createClass(Packet, [{
    key: 'size',
    value: function size() {
      return this.array.length;
    }

    // send writes the packet to the websocket connection

  }, {
    key: 'send',
    value: function send(conn) {
      conn.sendBytes(new Buffer(this.array));
    }

    // put

  }, {
    key: 'put',
    value: function put(n) {
      this.array[this.writePosition++] = n;
      return this;
    }

    // putInt16

  }, {
    key: 'putInt16',
    value: function putInt16(n) {
      n = Math.floor(n);
      if (n > 65535) {
        throw new Error('putInt16 Number ' + n + ' out of bounds');
      }

      this.array[this.writePosition++] = n >> 8 & 0xFF;
      this.array[this.writePosition++] = n & 0xFF;
      return this;
    }

    // putInt24

  }, {
    key: 'putInt24',
    value: function putInt24(n) {
      n = Math.floor(n);
      if (n > 16777215) {
        throw new Error('Int24 out of bound');
      }

      this.array[this.writePosition++] = n >> 16 & 0xFF;
      this.array[this.writePosition++] = n >> 8 & 0xFF;
      this.array[this.writePosition++] = n & 0xFF;
      return this;
    }

    // putString

  }, {
    key: 'putString',
    value: function putString(s) {
      var length = s.length;

      for (var i = 0; i < length; i++) {
        this.put(s.charCodeAt(i));
      }

      return this;
    }

    // read()

  }, {
    key: 'read',
    value: function read() {
      return this.array[this.readPosition++];
    }

    // readInt16

  }, {
    key: 'readInt16',
    value: function readInt16() {
      var byte1 = this.array[this.readPosition++];
      var byte2 = this.array[this.readPosition++];
      return byte1 << 8 | byte2;
    }

    // readInt24

  }, {
    key: 'readInt24',
    value: function readInt24() {
      var byte1 = this.array[this.readPosition++];
      var byte2 = this.array[this.readPosition++];
      var byte3 = this.array[this.readPosition++];
      return byte1 << 16 | byte2 << 8 | byte3;
    }

    // readString

  }, {
    key: 'readString',
    value: function readString(length) {
      var string = '';
      for (var i = 0; i < length; i++) {
        string += String.fromCharCode(this.read());
      }

      return string;
    }
  }]);

  return Packet;
}();

exports.default = Packet;
module.exports = exports['default'];