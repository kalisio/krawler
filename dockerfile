FROM  node:8-stretch

LABEL maintainer="Kalisio <contact@kalisio.xyz>"

# Install GDAL
RUN \
  apt-get update && \
  apt-get -y install gdal-bin

# Install Krawler
WORKDIR /opt/krawler
COPY . /opt/krawler
RUN yarn install
RUN yarn link
RUN yarn link @kalisio/krawler
ENV NODE_PATH=/opt/krawler/node_modules

HEALTHCHECK --interval=30s --timeout=30s --start-period=30s CMD node ./healthcheck.js

CMD node . $ARGS
