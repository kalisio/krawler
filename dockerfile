FROM node:8-buster AS builder
# Install krawler
COPY . /opt/krawler
WORKDIR /opt/krawler
# Build krawler
RUN yarn 

FROM  node:8-buster-slim
LABEL maintainer="Kalisio <contact@kalisio.xyz>"
# Install GDAL
RUN apt-get update && apt-get -y install gdal-bin
# Install Krawler
COPY --from=builder /opt/krawler /opt/krawler
RUN cd /opt/krawler && yarn link && yarn link @kalisio/krawler
ENV NODE_PATH=/opt/krawler/node_modules
# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=30s CMD node /opt/krawler/healthcheck.js
# Set command
CMD node . $ARGS
