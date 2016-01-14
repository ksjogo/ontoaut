FROM node:5

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ADD . /usr/src/app
RUN npm install

CMD [ "npm", "run-script", "start-dev" ]
EXPOSE 3001
