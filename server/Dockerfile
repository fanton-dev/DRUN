FROM node:14

ARG service_src
ARG service_test

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
COPY ./babel.config.js ./babel.config.js
COPY ${service_src} ./service/src
COPY ${service_test} ./service/test
COPY ./core ./core
CMD [ "npm", "run", "start" ]