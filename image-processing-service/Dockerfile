FROM --platform=linux/amd64 node:latest

WORKDIR /app

COPY ./package.json .

RUN npm install && npm cache clean --force

COPY . .

RUN npm run build

EXPOSE 80

CMD [ "npm", "start" ]