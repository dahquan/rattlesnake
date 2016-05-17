'use strict'

// Packet defines an object we are sending or receiving from the server
// https://github.com/iiegor/slither/blob/master/src/utils/message.coffee
class Packet {
  // Argument can be the size of a new packet or an existing array
  constructor() {
    let size;
    if(typeof arguments[0] === 'number') {
      this.array = new Uint8Array(arguments[0])
    } else {
      this.array = arguments[0]
    }

    this.readPosition = 0
    this.writePosition = 0
  }

  // size
  size() {
    return this.array.length
  }

  // send writes the packet to the websocket connection
  send(conn) {
    conn.sendBytes(new Buffer(this.array))
  }

  // put
  put(n) {
    this.array[this.writePosition++] = n
    return this
  }

  // putInt16
  putInt16(n) {
    n = Math.floor(n)
    if(n > 65535) {
      throw new Error(`putInt16 Number ${n} out of bounds`)
    }

    this.array[this.writePosition++] = n >> 8 & 0xFF
    this.array[this.writePosition++] = n & 0xFF
    return this
  }

  // putInt24
  putInt24(n) {
    n = Math.floor(n)
    if(n > 16777215) {
      throw new Error('Int24 out of bound')
    }

    this.array[this.writePosition++] = n >> 16 & 0xFF
    this.array[this.writePosition++] = n >> 8 & 0xFF
    this.array[this.writePosition++] = n & 0xFF
    return this
  }

  // putString
  putString(s) {
    const length = s.length

    for(let i = 0; i < length; i++) {
      this.put(s.charCodeAt(i))
    }

    return this
  }

  // read()
  read() {
    return this.array[this.readPosition++]
  }

  // readInt16
  readInt16() {
    const byte1 = this.array[this.readPosition++]
    const byte2 = this.array[this.readPosition++]
    return byte1 << 8 | byte2
  }

  // readInt24
  readInt24() {
    const byte1 = this.array[this.readPosition++]
    const byte2 = this.array[this.readPosition++]
    const byte3 = this.array[this.readPosition++]
    return byte1 << 16 | byte2 << 8 | byte3
  }

  // readString
  readString(length) {
    let string = ''
    for(var i = 0; i < length; i++) {
      string += String.fromCharCode(this.read())
    }

    return string
  }
}

export default Packet
