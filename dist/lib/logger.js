'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _winston2.default.Logger({
  level: 'debug',
  transports: [new _winston2.default.transports.Console({
    colorize: true
  })]
});
module.exports = exports['default'];