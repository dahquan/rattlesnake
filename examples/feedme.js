'use strict'

// BROWSER CODE
// COPY THE CODE BELOW INTO THE BROWSER DEVELOPER CONSOLE
//
// var xhttp=new XMLHttpRequest;xhttp.onreadystatechange=function(){4==xhttp.readyState&&200==xhttp.status&&eval(xhttp.responseText)},xhttp.open("GET","http://127.0.0.1:1337/inject",!0),xhttp.send();

// ========
//  Feed Me Example
//
// X - Speed all Bots
//
// This example will
// * Needs proxy servers

const Bot = require('../dist')
const express = require('express')
const fs = require('fs')
const path = require('path')

// Change the amount of bots per proxy
let perProxy = 2
if(!!process.env.SLITHER_PER_PROXY) {
  perProxy = parseInt(process.env.SLITHER_PER_PROXY)
}

// Skin to use on the bots
// If skin === -1: Bot will use same skin as you
let skin = -1

let server = ''
let gotoX = 0
let gotoY = 0

let proxies = fs
  .readFileSync(path.join(__dirname, 'proxies.txt'))
  .toString()
  .split(/\r?\n/)
  .filter(function(line) { return line.length > 0 })

const bots = []

const BOOTSTRAP = 'var xhttp=new XMLHttpRequest;xhttp.onreadystatechange=function(){4==xhttp.readyState&&200==xhttp.status&&eval(xhttp.responseText)},xhttp.open("GET","http://127.0.0.1:1337/inject",!0),xhttp.send();'

const INJECT =  "(function() {\r\n" +
"    var intv = 0;\r\n" +
"    var playClick = play_btn.elem.onclick;\r\n" +
"    var lastState = want_close_socket;\r\n" +
"    var oldConnect = connect;\r\n" +
"    function get(path) {\r\n" +
"        var xhttp = new XMLHttpRequest();\r\n" +
"        xhttp.open(\"GET\", \"http://127.0.0.1:1337/\" + path, true);\r\n" +
"        xhttp.send();\r\n" +
"    }\r\n" +
"    function start() {\r\n" +
"        intv = setInterval(function() {\r\n" +
"            if (snake) {\r\n" +
"                if (typeof fetch !== 'undefined') {\r\n" +
"                    get('goto?x=' + snake.xx + '&&y=' + snake.yy);\r\n" +
"                }\r\n" +
"            }\r\n" +
"        }, 1000);\r\n" +
"        window.onkeydown = function(e) {\r\n" +
"            if (e.keyCode === 88) {\r\n" +
"                get('speed/on');\r\n" +
"            }\r\n" +
"        };\r\n" +
"        window.onkeyup = function(e) {\r\n" +
"            if (e.keyCode === 88) {\r\n" +
"                get('speed/off');\r\n" +
"            }\r\n" +
"        };\r\n" +
"    }\r\n" +
"    function stop() {\r\n" +
"        clearInterval(intv);\r\n" +
"    }\r\n" +
"    play_btn.elem.onclick = function() {\r\n" +
"        start();\r\n" +
"        playClick();\r\n" +
"    };\r\n" +
"    window.connect = function() {\r\n" +
"        oldConnect();\r\n" +
"        get('server/' + bso.ip + ':' + bso.po + '?skin=' + localStorage.snakercv);\r\n" +
"        forceServer(bso.ip, bso.po);\r\n" +
"        window.connect = oldConnect;\r\n" +
"    }\r\n" +
"    console.log('You can start the bots now by logging in');\r\n" +
"    console.log('* Changing servers is not supported');\r\n" +
"})();\r\n";

// TODO: Handle unknown problems in bot
process.on('uncaughtException', function(err) { console.log(err) })

// Bots alive
let alive = 0

function print(msg) {
  console.log('[Bots Alive: ' + alive + ']\t\t' + msg)
}

function spawn() {
  print('Spawning ' + (proxies.length * perProxy) + ' snakes')

  proxies.forEach(function(proxy, pidx) {
    for(let i = 0; i < perProxy; i++) {
      const bot = new Bot({
        name: process.env.SLITHER_SERVER_NAME || 'www.slither.gg',
        // logLevel: 'debug',
        reconnect: true,
        skin: skin,
        server: server
      })

      bot.on('position', function(position, snake) {
        snake.facePosition(gotoX, gotoY)
      })

      bot.on('spawn', function() {
        alive++
        print(bot.name + ' spawned')
      })

      bot.on('disconnected', function() {
        alive--
        print(bot.name + ' died')
      })

      bots.push(bot)
      bot.connect(proxy)
    }
  })
}

// Open a tiny http server that can be used to change the gotoX-Y
// Make the bots go to my position

const app = express()

// GET /
// With query params:
//  x = new gotoX
//  y = new gotoY
app.get('/goto', function(req, res) {
  res.set('Access-Control-Allow-Origin', '*')
  res.end('ok')

  gotoX = req.query.x
  gotoY = req.query.y
})

// GET /server/:newServer
app.get('/server/:newServer', function(req, res) {
  if(!server.length) {
    server = req.params.newServer

    if(skin === -1) {
      skin = parseInt(req.query.skin)
    }

    spawn()
    res.set('Access-Control-Allow-Origin', '*')
    return res.json({ success: true })
  }

  res.set('Access-Control-Allow-Origin', '*')
  res.json({ error: 'Changing servers not implemented yet, restart the node app'})
})

// GET /speed/:on/off
app.get('/speed/:state', function(req, res) {
  res.set('Access-Control-Allow-Origin', '*')
  res.end('ok')

  bots.forEach(function(bot) {
    const snake = bot.me()
    if(bot.connected && snake) {
      snake.toggleSpeeding(req.params.state === 'on')
    }
  })
})

// GET /inject
app.get('/inject', function(req, res) {
  res.set('Access-Control-Allow-Origin', '*')
  res.end(INJECT)
})

if(proxies.length === 0) {
  console.log()
  console.log('!!!!!!!!!!!!!!!!!!!!!!! No proxy servers found! !!!!!!!!!!!!!!!!!!!!!!!')
  console.log('If you spawn too many proxies on this ip you may be temporary blocked from the server')
  console.log()

  proxies = [null]
}

console.log('Feed Me Bot')
console.log('1. Open a browser and navigate to http://slither.io')
console.log('2. Open this script file (examples/feedme.js) and copy the browser code all the way at the top of the file')
console.log('3. Go to the developer console then paste the browser code and press enter')
console.log('4. Login normally and you should see your bots start to connect')
console.log()
console.log('** Bots will stay on the same server even if you die and will NOT switch servers, to stop it press Ctrl+C')

app.listen(1337)
