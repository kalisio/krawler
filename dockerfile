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
RUN DEBIAN_FRONTEND=noninteractive && \
  apt-get update && \
  apt-get --no-install-recommends --yes install \
  gdal-bin proj-bin lftp ca-certificates && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# Install Krawler, change owner to 'node' user
COPY --from=builder --chown=node:node /opt/krawler /opt/krawler
WORKDIR /opt/krawler

# Now run operations as 'node' user
USER node

# - Make krawler available for others to link
# - Link krawler locally since jobs will import it
# - Make it executable, yarn link didn't do it
# - Put it in $PATH
RUN yarn link && \
  yarn link @kalisio/krawler && \
  chmod u+x ~/.yarn/bin/krawler
ENV PATH="${PATH}:~/.yarn/bin"

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=30s CMD node ./healthcheck.js

# Set command
CMD ~/.yarn/bin/krawler $ARGS
