FROM node:12-alpine3.12

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .
COPY ./.aws /root/.aws

RUN npm run build

CMD ["node", "build/index.js"]