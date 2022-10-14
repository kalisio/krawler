# 
# Make an mage alias to be build the Krawler
#
FROM node:16-bullseye AS builder
# Install krawler
COPY . /opt/krawler
WORKDIR /opt/krawler
# Build krawler
RUN yarn

#
# Make a slim image using the build image alias
#
FROM  node:16-bullseye-slim
LABEL maintainer="Kalisio <contact@kalisio.xyz>"

# Install GDAL
RUN apt-get update && apt-get -y install gdal-bin lftp

# Install Krawler
COPY --from=builder /opt/krawler /opt/krawler
WORKDIR /opt/krawler
RUN yarn link && yarn link @kalisio/krawler

# Required as yarn does not seem to set it correctly
RUN chmod u+x /usr/local/bin/krawler

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=30s CMD node ./healthcheck.js

# Set command
CMD krawler $ARGS
