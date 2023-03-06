# 
# Use a builder to build the Krawler
#
FROM node:16-bullseye AS builder
# Install krawler
COPY . /opt/krawler
WORKDIR /opt/krawler
# Build krawler
RUN yarn

#
# Make a slim image and copy from the build
#
FROM  node:16-bullseye-slim
LABEL maintainer="Kalisio <contact@kalisio.xyz>"

# Install Krawler, change owner to 'node' user
COPY --from=builder --chown=node:node /opt/krawler /opt/krawler
WORKDIR /opt/krawler

# Now run operations as 'node' user
USER node

# - Make krawler available for others to link
# - Make it executable, yarn link didn't do it
# - Put it in $PATH
RUN yarn link && chmod u+x ~/.yarn/bin/krawler
ENV PATH="${PATH}:~/.yarn/bin"

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=30s CMD node ./healthcheck.js

# Set command
ENV KRAWLER_BIN="~/.yarn/bin/krawler"
CMD $KRAWLER_BIN $ARGS
