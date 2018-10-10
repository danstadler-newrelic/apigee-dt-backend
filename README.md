This Node app represents a downstream/back-end app sitting behind an Apigee proxy.

It is based on original code found on the web, then modified for this integration project. BSD license only added in this project, not the original.

This is not yet tested for Dockerization but that step may be added later.


**test environment**
- Ubuntu 16


**prerequisites**
- Node, npm

**Clone the source code**
- https://github.com/danstadler-newrelic/apigee-dt-backend



**Step 1: build the project**
- cd into the project root directory
- npm install
- note that you should use npm audit to bring at least one dependency up to date ('ws' was the only one at time of this writing)

**Step 2: configure new relic**
- note that these steps have already been taken for adding New Relic to this app:
https://rpm.newrelic.com/accounts/[my-rpm-id]/applications/setup
- however you still need to add your license key and application name to newrelic.js (it is already copied into the root directory of the project.
- the require statement is already at the top of server.js


**Step 3: start the app**
- from the app root directory, run this:  npm start


**Step 4: monitor inbound calls**
- open this in the browser: http://localhost:3000/
- open the console
- you should see a connected message, and a timestamp message


**Step 5: make inbound calls**
- open this in the browser: http://localhost:3000/apigee-ingress-point
- this is the URL you need to hook up as the back-end endpoint from Apigee
- when it is called, 2 things will happen:
1) the console output from step 4 will show that an inbound call was processed
2) the page output from this step will show the same message (i.e. that's what would be sent back to apigee and the front-end caller).







=================================
original readme starts here:

# nodejs-websocket-example
it is an example of implementing websocket(ws) on both server and client side

## Install
```
$ npm install --save ws express
or 
$ git clone git@github.com:wahengchang/nodejs-websocket-example.git
```

## Unstanding ws
 `ws` is a WebSocket client and server implementation, fast, and easy to use ( [R]ead More](https://stackoverflow.com/questions/16392260/which-websocket-library-to-use-with-node-js) ).

#### client
`websocket client` is a browser supported object.

There are 3 basic must know fucntions:
 - `ws.onopen` : emmited when connected
 - `ws.send` : sending a send event to websocket server
 - `ws.onmessage` : event emmited when receiving message 

([Read More](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications))

```js
<script>
    var ws = new WebSocket('ws://localhost:40510');

    // event emmited when connected
    ws.onopen = function () {
        console.log('websocket is connected ...')

        // sending a send event to websocket server
        ws.send('connected')
    }

    // event emmited when receiving message 
    ws.onmessage = function (ev) {
        console.log(ev);
    }
</script>
```



#### server
server code is simple.

```js
var WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({port: 40510})

wss.on('connection', function (ws) {
  ws.on('message', function (message) {
    console.log('received: %s', message)
  })

  setInterval(
    () => ws.send(`${new Date()}`),
    1000
  )
})

```

## Run

Run server
```
$ npm start
``` 

Open browser
```
http://localhost:3000/
```

![image](https://user-images.githubusercontent.com/5538753/32210952-8d294d32-bdcd-11e7-9d14-b924fe52aacb.png)


## Reference
 - [https://github.com/wahengchang/nodejs-websocket-example](https://github.com/wahengchang/nodejs-websocket-example)
 - [https://github.com/websockets/ws](https://github.com/websockets/ws)
 - [https://websockets.github.io/ws/](https://websockets.github.io/ws/)
