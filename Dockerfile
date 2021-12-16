FROM node:16 as builder

WORKDIR /build

COPY package*.json ./
RUN npm install
COPY src/ ./src
COPY tsconfig* ./
RUN npm run build

FROM node:16-alpine

WORKDIR /app

COPY --from=builder /build/dist ./dist
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/package.json ./

EXPOSE 2900

CMD node dist/main.js