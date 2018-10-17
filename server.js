require('newrelic');
var express = require('express')
var app = express()
app.set('views', './views')
app.set('view engine', 'pug')

app.get('/', function (req, res) {
    res.render('ws')
})

// this function represents the ingress point for Apigee.
// it sends a test message back to the upstream caller.
app.get('/apigee-ingress-point', function (req, res) {

  // respond to upstream callers
  var test_message = {
    'value1': 'ABC',
    'value2': 'DEF',
    'timestamp': `${new Date()}`
  };
  res.send(JSON.stringify(test_message))
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
