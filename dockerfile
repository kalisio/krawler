FROM  node:8-buster-slim

LABEL maintainer="Kalisio <contact@kalisio.xyz>"

# Install GDAL
RUN apt-get update && apt-get -y install gdal-bin

# Install Krawler
COPY . /opt/krawler
WORKDIR /opt/krawler
RUN yarn && yarn link && yarn link @kalisio/krawler

ENV NODE_PATH=/opt/krawler/node_modules

HEALTHCHECK --interval=30s --timeout=30s --start-period=30s CMD node ./healthcheck.js

CMD node . $ARGS
