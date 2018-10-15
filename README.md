This Node app represents a downstream/back-end app sitting behind an Apigee proxy.

It is based on original code found on the web, then modified for this integration project. BSD license only added in this project, not the original.

This app has just gotten Dockerized. Please let me know if anything seems out of order.


**test environment**
- Ubuntu 16


**prerequisites**

1) if you want to build this and run it using npm start (when doing this, you'll have to edit your newrelic.yml file yourself, or work on your environment variables, see step 1a)
- Node
- npm
- build tools (i.e. go here https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04 and start from "How To Install Using a PPA", and make sure you go all the way through: sudo apt-get install build-essential)

2) If you want to run this just using Docker:
- Docker


**Clone the source code**
- https://github.com/danstadler-newrelic/apigee-dt-backend


**Step 1: modify your Dockerfile**
The first 2 of these need to be updated with your own values (third is optional):

- NEW_RELIC_APP_NAME: the name you want this app to appear as in New Relic APM

- NEW_RELIC_LICENSE_KEY: your RPM license key, available here: https://rpm.newrelic.com/accounts/[my-rpm-id]/applications/setup

- DOMAIN_AND_PORT
(this is really just optional... could just be localhost:40510, unless you are really needing to debug, in which case):
- for the websocket component, this needs to be passed in. It is the domain you are running this app on, then a colon, then the port you set up the websocket to listen on, also in docker-compose.yml.
- note that with domain, DON'T include "http://"
- for example: 
      - DOMAIN_AND_PORT=my-testing-back-end.com:40510

**Step 1a: test locally**
- you just need to export the newrelic environment variables for appName and licenseKey, then run npm start
- export NEW_RELIC_APP_NAME=your-app-name-here
- export NEW_RELIC_LICENSE_KEY=your-license-key-here
- npm start


**Step 2: build and deploy the container**
- leaving this up to the reader. Probably a combination of docker build, docker push, creating a cluster, using kubectl to create the pod, etc.

**Step 3: monitor inbound calls (this is the optional part from step 1)**
- open this in the browser: http://[your-app-domain]:3000/
- open the console
- you should see a connected message, and a timestamp message


**Step 4: make inbound calls**
- (this is just to prove that the app is running, before connecting it to an Apigee proxy)
- open this in the browser: http://[your-app-domain]:3000/apigee-ingress-point
- this is the URL you need to hook up as the back-end endpoint from Apigee
- when it is called, 2 things will happen:
1) the console output from step 4 will show that an inbound call was processed
2) the page output from this step will show the same message (i.e. that's what would be sent back to apigee and the front-end caller).


**Step 5: test**
- set up an Apigee pass-through proxy, pointing here:
- [your-service-IP]/apigee-ingress-point
- point the front-end code at that url (see step 4 part 2, here: https://github.com/danstadler-newrelic/apigee-dt-frontend/blob/master/README.md )






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
