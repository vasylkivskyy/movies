FROM node:16

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 8050

CMD [ "node", "server.js" ]