#!/bin/bash

# Source the environment
source .travis.env.sh

# Build the image
docker build -f dockerfile -t kalisio/krawler:$VERSION .

# Publish the image
docker login -u="$DOCKER_USER" -p="$DOCKER_PASSWORD"
docker push kalisio/krawler:$VERSION
