require('newrelic');
var express = require('express')

var WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({port: 40510})

wss.on('connection', function (ws) {
  ws.on('message', function (message) {
    console.log('received: %s', message)
  })
  ws.send(`${new Date()}`)
})

// Broadcast to all connected clients
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    //console.log(data);
    var stringed = JSON.stringify(data)
    client.send(stringed);
  });
};

// Static test var
var test_message = {
    'value1': 'ABC',
    'value2': 'DEF',
    'timestamp': `${new Date()}`
};

var app = express()
app.set('views', './views')
app.set('view engine', 'pug')

// you can open this page, and then open the browser's console, 
// to monitor inbound calls to /apigee-ingress-point
app.get('/', function (req, res) {
    res.render('ws', { domainAndPort: process.env.DOMAIN_AND_PORT })
})

// this function represents the ingress point for Apigee.
// it broadcasts to WebSocket clients (like in '/') that a call came in, 
// and it then sends the same test message back to the upstream caller.
app.get('/apigee-ingress-point', function (req, res) {
  // broadcast to clients
  wss.broadcast(test_message);
  // respond to upstream callers
  res.send(JSON.stringify(test_message))
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
