FROM  node:8

MAINTAINER Kalisio <contact@kalisio.xyz>

WORKDIR /opt/krawler
COPY . /opt/krawler

RUN yarn install

CMD node . $ARGS
