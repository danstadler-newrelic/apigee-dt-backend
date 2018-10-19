This Node app represents a downstream/back-end app sitting behind an Apigee proxy.

It is based on original code found on the web, then modified for this integration project. BSD license only added in this project, not the original.


**test environment**
- Ubuntu 16

**prerequisites**

1) Build/test/containerize:
- Node
- npm
- build tools (i.e. go here https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04 and start from "How To Install Using a PPA", and make sure you go all the way through: sudo apt-get install build-essential)
- Docker

3) pushing to gcloud: see this for an example: https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app

**Clone the source code**
- https://github.com/danstadler-newrelic/apigee-dt-backend


**Step 1: set up your environment variables**
These can be used both for testing with npm start, as well as for building the container and deploying to K8S.
```
export PROJECT_ID="$(gcloud config get-value project -q)"
export PROJECT_NAME=apigee-dt-back
export PROJECT_PORT=3000
export PROJECT_VERSION=v1
export NEW_RELIC_APP_NAME=your-APM-app-name-here
export NEW_RELIC_LICENSE_KEY=your-license-key-here
```

- NEW_RELIC_APP_NAME: the name you want this app to appear as in New Relic APM
- NEW_RELIC_LICENSE_KEY: your RPM license key, available here: https://rpm.newrelic.com/accounts/[my-rpm-id]/applications/setup


**Step 1a: test locally**
- npm start


**Step 2: build and test the container**
Based on the gcloud public doc above, you could do the following to build the container:

```
docker build \
--build-arg newrelic_appname=${NEW_RELIC_APP_NAME} \
--build-arg newrelic_license=${NEW_RELIC_LICENSE_KEY} \
-t gcr.io/${PROJECT_ID}/${PROJECT_NAME}:${PROJECT_VERSION} .
```

You could also test the container locally, as described in that doc:

```
docker run --rm -p ${PROJECT_PORT}:${PROJECT_PORT} gcr.io/${PROJECT_ID}/${PROJECT_NAME}:${PROJECT_VERSION}
```

**Step 3: deploy the container to K8S**
Again basing this on the above doc. You could do the following:

```
docker push gcr.io/${PROJECT_ID}/${PROJECT_NAME}:${PROJECT_VERSION}

kubectl run ${PROJECT_NAME} --image=gcr.io/${PROJECT_ID}/${PROJECT_NAME}:${PROJECT_VERSION} --port ${PROJECT_PORT}
kubectl get pods
kubectl expose deployment ${PROJECT_NAME} --type=LoadBalancer --port 80 --target-port ${PROJECT_PORT}
kubectl get service
```
The last command will take some time but will eventually tell you your load balancer's IP address. We'll refer to that as LOAD_BAL.

note: if you rebuild/re-push the container, the kubectl command is slightly different. Use the docker push command on the new container image, and then use this:
```
kubectl set image deployment/${PROJECT_NAME} ${PROJECT_NAME}=gcr.io/${PROJECT_ID}/${PROJECT_NAME}:${PROJECT_VERSION}
```


**Step 4: make inbound calls**
- (this is just to prove that the app is running, before connecting it to an Apigee proxy)
- open this in the browser: http://[LOAD_BAL]/apigee-ingress-point
- this is the URL you need to hook up as the back-end endpoint from Apigee
- when it is called, the output will show the test message - 2 dummy name/value pairs, and a third with a timestamp.


**Step 5: test**
- set up an Apigee pass-through proxy, pointing here:
- [LOAD_BAL]/apigee-ingress-point
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
