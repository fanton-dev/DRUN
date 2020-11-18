FROM node:14

ARG service_src

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY ${service_src} ./service/src
COPY ./core ./core
CMD [ "npm", "run", "start" ]