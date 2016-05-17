'use strict'

import winston from 'winston'

export default new (winston.Logger)({
  level: 'debug',
  transports: [
    new (winston.transports.Console)({
      colorize: true
    })
  ]
})
