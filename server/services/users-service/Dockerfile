FROM node:14

WORKDIR /opt/app/core

COPY ./package*.json ./

RUN npm ci

WORKDIR /opt/app/services/users-service

COPY ./package*.json ./

RUN npm ci

EXPOSE 3004

CMD npm run db:migrate ; npm run watch
