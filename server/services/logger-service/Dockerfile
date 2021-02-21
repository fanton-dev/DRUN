FROM node:14

WORKDIR /opt/app

COPY ./package*.json ./

RUN npm ci

EXPOSE 3003

CMD [ "npm", "run", "watch" ]
