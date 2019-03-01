FROM  node:8

LABEL maintainer="Kalisio <contact@kalisio.xyz>"

# Install GDAL
RUN \
  apt-get update && \
  apt-get -y install gdal-bin

# Install Krawler
WORKDIR /opt/krawler
COPY . /opt/krawler
RUN yarn install

CMD node . $ARGS
