FROM node:lts-alpine

WORKDIR /app

ARG URL
ENV URL=$URL

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "node", ".output/server/index.mjs" ]