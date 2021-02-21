FROM node:14

WORKDIR /opt/app

COPY ./package.json /opt/app/package.json

COPY ./yarn.lock /opt/app/yarn.lock

EXPOSE 3004

CMD yarn && yarn watch
