FROM node:14

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm ci
COPY ./babel.config.js ./babel.config.js
COPY ./tsconfig.json ./tsconfig.json

EXPOSE 3001
EXPOSE 3002
EXPOSE 3003

CMD [ "npm", "run", "start:dev" ]