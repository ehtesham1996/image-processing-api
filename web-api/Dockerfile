FROM --platform=linux/amd64 node:latest

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install && npm cache clean --force

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "docker:run" ]