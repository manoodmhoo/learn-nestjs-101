# Dockerfile
FROM node:20.17.0

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install --save-dev prettier

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]