FROM node:20.8.0-buster AS build-image

WORKDIR /build
COPY src ./src
COPY package*.json entry.sh aws-lambda-rie ./
COPY src/data.json /data.json

# Required for Node runtimes which use npm@8.6.0+ because
# by default npm writes logs under /home/.npm and Lambda fs is read-only
ENV NPM_CONFIG_CACHE=/tmp/.npm

RUN set -x && \
  apt update && \
  apt install -y \
    g++ \
    make \
    cmake \
    unzip \
    libcurl4-openssl-dev && \
  npm install -g npm@10.2.0 && \
  npm install && \
  npm i aws-lambda-ric && \
  npm run build:app && \
  rm -rf src

FROM node:20.8.0-alpine3.17

COPY --from=build-image /build /lambda
COPY --from=build-image /build/aws-lambda-rie /usr/local/bin/aws-lambda-rie
WORKDIR /lambda

ENTRYPOINT ["/lambda/entry.sh"]

CMD ["index.handler"]
