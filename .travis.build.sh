#!/bin/bash

# Source the environment
source .travis.env.sh

# Build the image
docker build -f dockerfile -t $IMAGE_NAME:$IMAGE_TAG .

# Publish the image
docker login -u="$DOCKER_USER" -p="$DOCKER_PASSWORD"
docker push $IMAGE_NAME:$IMAGE_TAG
