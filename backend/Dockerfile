FROM node:5

RUN mkdir -p /usr/src/app/data
WORKDIR /usr/src/app

ADD ./package.json package.json
RUN npm install

CMD [ "npm", "start"]
EXPOSE 3001

ADD ./.babelrc .babelrc
ADD ./src src
