#!/bin/bash
# in case we need to use this script standalone
# get the code
#git clone --recurse-submodules https://github.com/bloxmove-com/bloxmove-tomp-gateway.git

#cd bloxmove-tomp-gateway

# TODO:ask user for TOMP_ACCEPT_LANGUAGE, TOMP_MAAS_ID and TOMP_TRANSPORT_OPERATOR_BASE_URL
TOMP_ACCEPT_LANGUAGE="nl"
TOMP_MAAS_ID="d52bfad0-ee4b-4f72-9f38-efce115ffb49"
TOMP_TRANSPORT_OPERATOR_BASE_URL="http://3.123.228.24:8083"

# install dependency
docker run --rm --volume $PWD:/build -u node node:16 sh -c "cd /build/ && npm install"

FILE="./Dockerfile-stable"
cat > ${FILE} <<- EOF
FROM node:16-alpine

WORKDIR /app

EXPOSE 2900

CMD npm start
EOF

# write following content to docker-compose.yml
FILE="./docker-compose.yml"
cat > ${FILE} <<- EOF
version: '3.9'
services:
  tomp-gateway:
    build:
      context: .
      dockerfile: Dockerfile-stable
    volumes:
      # Mount source-code for development
      - ./:/app
    environment:
      - NODE_ENV=local
      - TOMP_API_VERSION=1.0.0
      - TOMP_ACCEPT_LANGUAGE=${TOMP_ACCEPT_LANGUAGE}
      - TOMP_MAAS_ID=${TOMP_MAAS_ID}
      - TOMP_TRANSPORT_OPERATOR_BASE_URL=${TOMP_TRANSPORT_OPERATOR_BASE_URL}
      - API=TOMP
    ports:
      - '2900:2900'
EOF

docker-compose up -d