FROM node:16 as builder

WORKDIR /build

COPY package*.json ./
RUN npm install

FROM node:16-alpine

WORKDIR /app

COPY --from=builder ./build .
COPY . .
RUN chown -R node:node /app
USER 1000

EXPOSE 2900

CMD npm start