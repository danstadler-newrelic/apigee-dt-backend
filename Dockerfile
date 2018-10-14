FROM node:8
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000 40510
ENV NEW_RELIC_APP_NAME=your-app-name-here \
    NEW_RELIC_LICENSE_KEY=your-license-key-here \
    DOMAIN_AND_PORT=your-domain-and-port-here
CMD [ "npm", "start" ]
