FROM node:8
ARG newrelic_appname=your-app-name
ARG newrelic_license=your-license-key
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000 40510
ENV NEW_RELIC_APP_NAME=$newrelic_appname \
    NEW_RELIC_LICENSE_KEY=$newrelic_license
CMD [ "npm", "start" ]
