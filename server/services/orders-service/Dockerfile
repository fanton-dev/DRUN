FROM node:14

WORKDIR /opt/app

COPY ./package*.json ./

RUN npm ci

EXPOSE 3001

CMD [ "npm", "run", "watch" ]
