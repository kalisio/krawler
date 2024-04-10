# 
# Use a builder to build the Krawler
#
FROM node:16-bookworm AS builder
# Install krawler
COPY . /opt/krawler
WORKDIR /opt/krawler
# Build krawler
RUN yarn

#
# Make a slim image and copy from the build
#
FROM  node:16-bookworm-slim
LABEL maintainer="Kalisio <contact@kalisio.xyz>"

# Install Krawler, change owner to 'node' user
COPY --from=builder --chown=node:node /opt/krawler /opt/krawler
WORKDIR /opt/krawler

# Now run operations as 'node' user
USER node

# - Make krawler available for others to link
# - Make it executable, yarn link didn't do it
RUN yarn link && chmod u+x ~/.yarn/bin/krawler

# Put a symlink in /usr/local/bin
# This is a bit of a hack but I couldnt make 'krawler' command available
# using ENV PATH="${PATH}:~/.yarn/bin"
USER root
RUN ln -s /home/node/.yarn/bin/krawler /usr/local/bin
USER node

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=30s CMD node ./healthcheck.js

# Set command
CMD krawler $ARGS
