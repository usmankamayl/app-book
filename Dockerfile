FROM node:16.10.0-alpine

WORKDIR /app

COPY src/package*.json ./
RUN npm install 
COPY src/  ./src

CMD ["npm", "start"]