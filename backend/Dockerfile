FROM node:12

WORKDIR /usr/src/app/backend

COPY package*.json ./

RUN npm install

EXPOSE 3080

CMD ["npm", "start"]