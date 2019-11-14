#!/bin/bash

# Define image name
IMAGE_NAME="$TRAVIS_REPO_SLUG"

# Define image tag
# Use version number only on release
if [[ -z "$TRAVIS_TAG" ]]
then
	IMAGE_TAG=latest
else
	IMAGE_TAG=$(node -p -e "require('./package.json').version")
fi
