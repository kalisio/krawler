#!/bin/bash
source travis.env.sh

docker build -f dockerfile -t kalisio/krawler .
docker tag kalisio/krawler kalisio/krawler:$VERSION
docker login -u="$DOCKER_USER" -p="$DOCKER_PASSWORD"
docker push kalisio/krawler:$VERSION
