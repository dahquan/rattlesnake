'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _messageMap;

exports.parse = parse;

var _packet = require('./packet');

var _packet2 = _interopRequireDefault(_packet);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _messages = require('../constants/messages');

var messages = _interopRequireWildcard(_messages);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var messageMap = (_messageMap = {}, _defineProperty(_messageMap, messages.INITIAL, require('../messages/initial')), _defineProperty(_messageMap, messages.POSITION, require('../messages/position')), _defineProperty(_messageMap, messages.EAT, require('../messages/eat')), _defineProperty(_messageMap, messages.LEADERBOARD, require('../messages/leaderboard')), _defineProperty(_messageMap, messages.DEAD, require('../messages/dead')), _defineProperty(_messageMap, messages.SNAKE, require('../messages/snake')), _messageMap);

// Parse a message packet
function parse(data) {
  var packet = new _packet2.default(data);
  // Ignore the first 2 bytes... at least for now
  packet.readInt16();

  var messageType = packet.read();

  var messageHandler = messageMap[messageType];
  if (typeof messageHandler === 'undefined') {
    // Ignore those for now, they are annoying :^)
    // logger.error('No message handler for message %d', messageType)
    return null;
  }

  return Object.assign({
    messageType: messageType
  }, messageHandler.deflate(packet));
}