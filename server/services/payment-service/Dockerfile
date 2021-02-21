FROM node:14

WORKDIR /opt/app

COPY ./package*.json ./

RUN npm ci

CMD [ "npm", "run", "watch" ]
