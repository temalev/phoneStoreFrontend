FROM node:lts-alpine

WORKDIR /app

ENV URL = "https://rk-tech.shop/api/v1"

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "node", ".output/server/index.mjs" ]