'use strict'

let Socks = require('socks');

import { client as WebSocketClient } from 'websocket'
import { EventEmitter } from 'events'
import util from 'util'
import { Logger, transports } from 'winston'
import tunnel from 'tunnel'
import SocksProxyAgent from 'socks-proxy-agent'

import Packet from './lib/packet'
import Snake from './snake'
import * as parser from './lib/parser'

import { PROTOCOL_VERSION } from './constants/slither'
import * as messages from './constants/messages'

// Bot
class Bot extends EventEmitter {
  // Options
  // name - snake name
  // server - server address to connect to
  // reconnect - whether to reconnect or not after death or disconnect
  constructor(options) {
    super()

    const { name, server, skin } = options

    this.logger = new Logger({
      level: options.logLevel || 'info',
      transports: [new transports.Console()]
    })

    this.options = options
    this.name = name
    this.server = server
    this.skin = skin

    this.conn = null
    this.connected = false

    this.leaderboard = []
    this.snakes = {}
    this.myId = null
  }

  connecthttp(proxyServer) {
    this.logger.debug(`Connecting bot ${this.name} (${this.server})`.yellow)
    this.proxyServer = proxyServer

    const client = new WebSocketClient()
    const requestOptions = {}

    // Tunnel through proxy server if the option is there
    if(typeof proxyServer === 'string') {
      const AUTH = process.env.PROXY_AUTH || null
	  var mode = 'http'
      if(proxyServer.indexOf('socks') === 0) {
        mode = 'socks'
      }

      if(mode === 'http') {
        const proxy = {
          host: proxyServer,
          port: 80
        }

        let idx = proxy.host.indexOf(':')
        if(idx > 0) {
          proxy.port = proxy.host.substring(idx + 1)
          proxy.host = proxy.host.substring(0, idx)
        }

        if(AUTH) {
          proxy.proxyAuth = AUTH
        }

        requestOptions.agent = tunnel.httpOverHttp({
          proxy
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
      }
    } else if(typeof proxyServer === 'object') {
      requestOptions.agent = proxyServer
    }

    // connectFailed
    client.on('connectFailed', err => {
      this.logger.debug('[%s] %s', this.name, err)

      this.emit('error', err)
      this.emit('errorConnect', err)
    })

    client.on('connect', this.onConnect.bind(this))
    client.connect(`ws://${this.server}/slither`, null, 'http://slither.io', null, requestOptions)
  }
  connectsocks4(proxyServer) {
    this.logger.debug(`Connecting bot ${this.name} (${this.server})`.yellow)
    this.proxyServer = proxyServer

    const client = new WebSocketClient()
    const requestOptions = {}

    // Tunnel through proxy server if the option is there
    if(typeof proxyServer === 'string') {
      const AUTH = process.env.PROXY_AUTH || null
	  var mode = 'socks4'
      if(proxyServer.indexOf('socks') === 0) {
        mode = 'socks'
      }

      if(mode === 'http') {
        const proxy = {
          host: proxyServer,
          port: 80
        }

        let idx = proxy.host.indexOf(':')
        if(idx > 0) {
          proxy.port = proxy.host.substring(idx + 1)
          proxy.host = proxy.host.substring(0, idx)
        }

        if(AUTH) {
          proxy.proxyAuth = AUTH
        }

        requestOptions.agent = tunnel.httpOverHttp({
          proxy
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
      }
    } else if(typeof proxyServer === 'object') {
      requestOptions.agent = proxyServer
    }
	connectsocks5(proxyServer) {
    this.logger.debug(`Connecting bot ${this.name} (${this.server})`.yellow)
    this.proxyServer = proxyServer

    const client = new WebSocketClient()
    const requestOptions = {}

    // Tunnel through proxy server if the option is there
    if(typeof proxyServer === 'string') {
      const AUTH = process.env.PROXY_AUTH || null
	  var mode = 'socks5'
      if(proxyServer.indexOf('socks') === 0) {
        mode = 'socks'
      }

      if(mode === 'http') {
        const proxy = {
          host: proxyServer,
          port: 80
        }

        let idx = proxy.host.indexOf(':')
        if(idx > 0) {
          proxy.port = proxy.host.substring(idx + 1)
          proxy.host = proxy.host.substring(0, idx)
        }

        if(AUTH) {
          proxy.proxyAuth = AUTH
        }

        requestOptions.agent = tunnel.httpOverHttp({
          proxy
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
      }
    } else if(typeof proxyServer === 'object') {
      requestOptions.agent = proxyServer
    }

  // me will return the snake that belongs to you
  me() {
    return this.snakes[this.myId]
  }

  // onConnect gets called once we successfully connect to the slither.io
  // game server
  onConnect(connection) {
    this.logger.debug(`[${this.name}] has successfully connected`.rainbow)
    this.conn = connection
    this.connected = true

    connection.on('error', error => {
      this.logger.debug('[%s] Error - %s', this.name, error)
      this.emit('error', error)
    })

    connection.on('close', this.onClose.bind(this))
    connection.on('message', this.onMessage.bind(this))

    // Send the initial packet
    // SetUsernameAndSkin
    // https://github.com/ClitherProject/Slither.io-Protocol/blob/master/Protocol.md#packet-setusernameandskin
    const initialPacket = new Packet(3 + this.name.length)
    initialPacket.put(115)
    initialPacket.put(PROTOCOL_VERSION - 1)
    initialPacket.put(this.skin || 44)
    initialPacket.putString(this.name)
    initialPacket.send(this.conn)
  }

  // onMessage
  onMessage(message) {
    if(message.type !== 'binary') {
      return
    }

    const parsedMessage = parser.parse(message.binaryData)
    if(!parsedMessage) {
      return
    }

    let snake;

    switch(parsedMessage.messageType) {
      case messages.INITIAL:
        // Make sure the protocol version matches
        if(parsedMessage.protocolVersion !== PROTOCOL_VERSION) {
          this.logger.error('[%s] Protocol version mismatch. %d > %d', this.name,
            PROTOCOL_VERSION, parsedMessage.protocolVersion)
          this.conn.close()
        }
        break

      case messages.SNAKE:
        if(parsedMessage.removing) {
          if(typeof this.snakes[parsedMessage.id] !== 'undefined') {
            const snake = this.snakes[parsedMessage.id]

            this.logger.debug('[%s] Removing snake %s', this.name,
              snake.name)
            this.emit('snakeLeft', snake, (snake.id === this.myId))

            delete this.snakes[parsedMessage.id]
          }
          return
        }

        snake = new Snake(this, parsedMessage)

        // The first snake in our view will be us
        if(!this.myId) {
          this.myId = parsedMessage.id
          this.emit('spawn', snake)
        }

        this.snakes[parsedMessage.id] = snake
        this.emit('snakeEnter', snake, (parsedMessage.id === this.myId))
        break

      case messages.LEADERBOARD:
        this.leaderboard = parsedMessage.snakes
        this.emit('leaderboard', this.leaderboard)
        break

      case messages.DEAD:
        this.logger.debug('[%s] Just died', this.name)
        this.emit('dead', parsedMessage)
        break

      case messages.EAT:
        this.emit('ate')
        break;

      case messages.POSITION:
        snake = this.snakes[parsedMessage.id]
        if(typeof snake !== 'undefined') {
          snake.x = parsedMessage.x
          snake.y = parsedMessage.y

          this.emit('snakePosition', parsedMessage, snake)

          if(snake.id === this.myId) {
            this.emit('position', parsedMessage, snake)
          }
        }
        break
    }
  }

  // onClose
  onClose(reason) {
    this.logger.debug(`[${this.name}] Disconnected (${reason})`.red)
    this.connected = false
    this.conn = null
    this.leaderboard = []
    this.snakes = {}
    this.myId = null

    this.emit('disconnected')

    // Reconnect after we close (probably died)
    if(this.options.reconnect) {
      setTimeout(() => {
        this.connect(this.proxyServer)
      }, 2000) // TODO: Make this a configuration
    }
  }

  // close
  close() {
    if(this.conn !== null) {
      this.conn.close()
    }
  }

  // toJSON
  toJSON() {
    const { id, name, server, connected, leaderboard } = this
    return {
      id,
      name,
      server,
      connected,
      leaderboard,

      // Will deal with this later
      enabled: true
    }
  }
}

// For some reason a ton of slither.io servers don't return the expected WebSocket
// accept key during handshake. This causes the bot to terminate the connection.
//
// This "Hack" will stop it from closing
//
// TODO: Figure out the cause of this
WebSocketClient.prototype.failHandshake = function(reason) {
  if(reason.indexOf('Sec-WebSocket-Accept header from server didn\'t match') >= 0) {
    // Ignore it and accept
    this.succeedHandshake()
  }
}
export default Bot
