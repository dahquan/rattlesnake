'use strict';

let Socks = require('socks');

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
    return typeof obj;
} : function(obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

var _createClass = function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

var _websocket = require('websocket');

var _events = require('events');

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _winston = require('winston');

var _tunnel = require('tunnel');

var _tunnel2 = _interopRequireDefault(_tunnel);

var _socksProxyAgent = require('socks-proxy-agent');

var _socksProxyAgent2 = _interopRequireDefault(_socksProxyAgent);

var _packet = require('./lib/packet');

var _packet2 = _interopRequireDefault(_packet);

var _snake2 = require('./snake');

var _snake3 = _interopRequireDefault(_snake2);

var _parser = require('./lib/parser');

var parser = _interopRequireWildcard(_parser);

var _slither = require('./constants/slither');

var _messages = require('./constants/messages');

var messages = _interopRequireWildcard(_messages);

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};
        if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }
        newObj.default = obj;
        return newObj;
    }
}

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

// Bot

var Bot = function(_EventEmitter) {
    _inherits(Bot, _EventEmitter);

    // Options
    // name - snake name
    // server - server address to connect to
    // reconnect - whether to reconnect or not after death or disconnect

    function Bot(options) {
        _classCallCheck(this, Bot);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Bot).call(this));

        var name = options.name;
        var server = options.server;
        var skin = options.skin;


        _this.logger = new _winston.Logger({
            level: options.logLevel || 'info',
            transports: [new _winston.transports.Console()]
        });

        _this.options = options;
        _this.name = name;
        _this.server = server;
        _this.skin = skin;

        _this.conn = null;
        _this.connected = false;

        _this.leaderboard = [];
        _this.snakes = {};
        _this.myId = null;
        return _this;
    }

    _createClass(Bot, [{
        key: 'connecthttp',
        value: function connecthttp(proxyServer) {
            var _this2 = this;

            this.logger.debug(('Connecting bot ' + this.name + ' (' + this.server + ')').yellow);
            this.proxyServer = proxyServer;

            var client = new _websocket.client();
            var requestOptions = {};

            // Tunnel through proxy server if the option is there
            if (typeof proxyServer === 'string') {
                var AUTH = process.env.PROXY_AUTH || null;
				var mode = 'http'
                if (proxyServer.indexOf('socks') === 0) {
                    mode = 'socks';
                }

                if (mode === 'http') {
                    var proxy = {
                        host: proxyServer,
                        port: 80
                    };

                    var idx = proxy.host.indexOf(':');
                    if (idx > 0) {
                        proxy.port = proxy.host.substring(idx + 1);
                        proxy.host = proxy.host.substring(0, idx);
                    }

                    if (AUTH) {
                        proxy.proxyAuth = AUTH;
                    }

                    requestOptions.agent = _tunnel2.default.httpOverHttp({
                        proxy: proxy
                    });
                } else if (mode === 'socks5') {
    console.log('Mode socks5, proxy', proxyServer);
    let temp = proxyServer.split(':');
    let socksIp = temp[0]
    let socksPort = temp[1];
    requestOptions.agent = new Socks.Agent({
        proxy: {
             ipaddress: socksIp,
            port: socksPort,
            type: 5
        }
    });
} else if (mode === 'socks4') {
    console.log('Mode socks4, proxy', proxyServer);
    let temp = proxyServer.split(':');
    let socksIp = temp[0]
    let socksPort = temp[1];
    requestOptions.agent = new Socks.Agent({
        proxy: {
             ipaddress: socksIp,
            port: socksPort,
            type: 4
        }
    });
}
            } else if ((typeof proxyServer === 'undefined' ? 'undefined' : _typeof(proxyServer)) === 'object') {
                requestOptions.agent = proxyServer;
            }

            // connectFailed
            client.on('connectFailed', function(err) {
                _this2.logger.debug('[%s] %s', _this2.name, err);

                _this2.emit('error', err);
                _this2.emit('errorConnect', err);
            });

            client.on('connect', this.onConnect.bind(this));
            client.connect('ws://' + this.server + '/slither', null, 'http://slither.io', null, requestOptions);
		}
        }, {
		key: 'connectsocks4',
        value: function connectsocks4(proxyServer) {
            var _this2 = this;

            this.logger.debug(('Connecting bot ' + this.name + ' (' + this.server + ')').yellow);
            this.proxyServer = proxyServer;

            var client = new _websocket.client();
            var requestOptions = {};

            // Tunnel through proxy server if the option is there
            if (typeof proxyServer === 'string') {
                var AUTH = process.env.PROXY_AUTH || null;
				var mode = 'socks4'
                if (proxyServer.indexOf('socks') === 0) {
                    mode = 'socks';
                }

                if (mode === 'http') {
                    var proxy = {
                        host: proxyServer,
                        port: 80
                    };

                    var idx = proxy.host.indexOf(':');
                    if (idx > 0) {
                        proxy.port = proxy.host.substring(idx + 1);
                        proxy.host = proxy.host.substring(0, idx);
                    }

                    if (AUTH) {
                        proxy.proxyAuth = AUTH;
                    }

                    requestOptions.agent = _tunnel2.default.httpOverHttp({
                        proxy: proxy
                    });
                } else if (mode === 'socks5') {
    console.log('Mode socks5, proxy', proxyServer);
    let temp = proxyServer.split(':');
    let socksIp = temp[0]
    let socksPort = temp[1];
    requestOptions.agent = new Socks.Agent({
        proxy: {
             ipaddress: socksIp,
            port: socksPort,
            type: 5
        }
    });
} else if (mode === 'socks4') {
    console.log('Mode socks4, proxy', proxyServer);
    let temp = proxyServer.split(':');
    let socksIp = temp[0]
    let socksPort = temp[1];
    requestOptions.agent = new Socks.Agent({
        proxy: {
             ipaddress: socksIp,
            port: socksPort,
            type: 4
        }
    });
}
            } else if ((typeof proxyServer === 'undefined' ? 'undefined' : _typeof(proxyServer)) === 'object') {
                requestOptions.agent = proxyServer;
            }

            // connectFailed
            client.on('connectFailed', function(err) {
                _this2.logger.debug('[%s] %s', _this2.name, err);

                _this2.emit('error', err);
                _this2.emit('errorConnect', err);
            });

            client.on('connect', this.onConnect.bind(this));
            client.connect('ws://' + this.server + '/slither', null, 'http://slither.io', null, requestOptions);
        }
		}, {
		key: 'connectsocks5',
        value: function connectsocks5(proxyServer) {
            var _this2 = this;

            this.logger.debug(('Connecting bot ' + this.name + ' (' + this.server + ')').yellow);
            this.proxyServer = proxyServer;

            var client = new _websocket.client();
            var requestOptions = {};

            // Tunnel through proxy server if the option is there
            if (typeof proxyServer === 'string') {
                var AUTH = process.env.PROXY_AUTH || null;
				var mode = 'socks5'
                if (proxyServer.indexOf('socks') === 0) {
                    mode = 'socks';
                }

                if (mode === 'http') {
                    var proxy = {
                        host: proxyServer,
                        port: 80
                    };

                    var idx = proxy.host.indexOf(':');
                    if (idx > 0) {
                        proxy.port = proxy.host.substring(idx + 1);
                        proxy.host = proxy.host.substring(0, idx);
                    }

                    if (AUTH) {
                        proxy.proxyAuth = AUTH;
                    }

                    requestOptions.agent = _tunnel2.default.httpOverHttp({
                        proxy: proxy
                    });
                } else if (mode === 'socks5') {
    console.log('Mode socks5, proxy', proxyServer);
    let temp = proxyServer.split(':');
    let socksIp = temp[0]
    let socksPort = temp[1];
    requestOptions.agent = new Socks.Agent({
        proxy: {
             ipaddress: socksIp,
            port: socksPort,
            type: 5
        }
    });
} else if (mode === 'socks4') {
    console.log('Mode socks4, proxy', proxyServer);
    let temp = proxyServer.split(':');
    let socksIp = temp[0]
    let socksPort = temp[1];
    requestOptions.agent = new Socks.Agent({
        proxy: {
             ipaddress: socksIp,
            port: socksPort,
            type: 4
        }
    });
}
            } else if ((typeof proxyServer === 'undefined' ? 'undefined' : _typeof(proxyServer)) === 'object') {
                requestOptions.agent = proxyServer;
            }

            // connectFailed
            client.on('connectFailed', function(err) {
                _this2.logger.debug('[%s] %s', _this2.name, err);

                _this2.emit('error', err);
                _this2.emit('errorConnect', err);
            });

            client.on('connect', this.onConnect.bind(this));
            client.connect('ws://' + this.server + '/slither', null, 'http://slither.io', null, requestOptions);
        }
		

        // me will return the snake that belongs to you

    }, {
        key: 'me',
        value: function me() {
            return this.snakes[this.myId];
        }

        // onConnect gets called once we successfully connect to the slither.io
        // game server

    }, {
        key: 'onConnect',
        value: function onConnect(connection) {
            var _this3 = this;

            this.logger.debug(('[' + this.name + '] has successfully connected').rainbow);
            this.conn = connection;
            this.connected = true;

            connection.on('error', function(error) {
                _this3.logger.debug('[%s] Error - %s', _this3.name, error);
                _this3.emit('error', error);
            });

            connection.on('close', this.onClose.bind(this));
            connection.on('message', this.onMessage.bind(this));

            // Send the initial packet
            // SetUsernameAndSkin
            // https://github.com/ClitherProject/Slither.io-Protocol/blob/master/Protocol.md#packet-setusernameandskin
            var initialPacket = new _packet2.default(3 + this.name.length);
            initialPacket.put(115);
            initialPacket.put(_slither.PROTOCOL_VERSION - 1);
            initialPacket.put(this.skin || 44);
            initialPacket.putString(this.name);
            initialPacket.send(this.conn);
        }

        // onMessage

    }, {
        key: 'onMessage',
        value: function onMessage(message) {
            if (message.type !== 'binary') {
                return;
            }

            var parsedMessage = parser.parse(message.binaryData);
            if (!parsedMessage) {
                return;
            }

            var snake = void 0;

            switch (parsedMessage.messageType) {
                case messages.INITIAL:
                    // Make sure the protocol version matches
                    if (parsedMessage.protocolVersion !== _slither.PROTOCOL_VERSION) {
                        this.logger.error('[%s] Protocol version mismatch. %d > %d', this.name, _slither.PROTOCOL_VERSION, parsedMessage.protocolVersion);
                        this.conn.close();
                    }
                    break;

                case messages.SNAKE:
                    if (parsedMessage.removing) {
                        if (typeof this.snakes[parsedMessage.id] !== 'undefined') {
                            var _snake = this.snakes[parsedMessage.id];

                            this.logger.debug('[%s] Removing snake %s', this.name, _snake.name);
                            this.emit('snakeLeft', _snake, _snake.id === this.myId);

                            delete this.snakes[parsedMessage.id];
                        }
                        return;
                    }

                    snake = new _snake3.default(this, parsedMessage);

                    // The first snake in our view will be us
                    if (!this.myId) {
                        this.myId = parsedMessage.id;
                        this.emit('spawn', snake);
                    }

                    this.snakes[parsedMessage.id] = snake;
                    this.emit('snakeEnter', snake, parsedMessage.id === this.myId);
                    break;

                case messages.LEADERBOARD:
                    this.leaderboard = parsedMessage.snakes;
                    this.emit('leaderboard', this.leaderboard);
                    break;

                case messages.DEAD:
                    this.logger.debug('[%s] Just died', this.name);
                    this.emit('dead', parsedMessage);
                    break;

                case messages.EAT:
                    this.emit('ate');
                    break;

                case messages.POSITION:
                    snake = this.snakes[parsedMessage.id];
                    if (typeof snake !== 'undefined') {
                        snake.x = parsedMessage.x;
                        snake.y = parsedMessage.y;

                        this.emit('snakePosition', parsedMessage, snake);

                        if (snake.id === this.myId) {
                            this.emit('position', parsedMessage, snake);
                        }
                    }
                    break;
            }
        }

        // onClose

    }, {
        key: 'onClose',
        value: function onClose(reason) {
            var _this4 = this;

            this.logger.debug(('[' + this.name + '] Disconnected (' + reason + ')').red);
            this.connected = false;
            this.conn = null;
            this.leaderboard = [];
            this.snakes = {};
            this.myId = null;

            this.emit('disconnected');

            // Reconnect after we close (probably died)
            if (this.options.reconnect) {
                setTimeout(function() {
                    _this4.connect(_this4.proxyServer);
                }, 2000); // TODO: Make this a configuration
            }
        }

        // close

    }, {
        key: 'close',
        value: function close() {
            if (this.conn !== null) {
                this.conn.close();
            }
        }

        // toJSON

    }, {
        key: 'toJSON',
        value: function toJSON() {
            var id = this.id;
            var name = this.name;
            var server = this.server;
            var connected = this.connected;
            var leaderboard = this.leaderboard;

            return {
                id: id,
                name: name,
                server: server,
                connected: connected,
                leaderboard: leaderboard,

                // Will deal with this later
                enabled: true
            };
        }
    }]);

    return Bot;
}(_events.EventEmitter);

// For some reason a ton of slither.io servers don't return the expected WebSocket
// accept key during handshake. This causes the bot to terminate the connection.
//
// This "Hack" will stop it from closing
//
// TODO: Figure out the cause of this


_websocket.client.prototype.failHandshake = function(reason) {
    if (reason.indexOf('Sec-WebSocket-Accept header from server didn\'t match') >= 0) {
        // Ignore it and accept
        this.succeedHandshake();
    }
};
exports.default = Bot;
module.exports = exports['default'];
