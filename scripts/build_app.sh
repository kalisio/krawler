#!/usr/bin/env bash
set -euo pipefail
# set -x

THIS_FILE=$(readlink -f "${BASH_SOURCE[0]}")
THIS_DIR=$(dirname "$THIS_FILE")
ROOT_DIR=$(dirname "$THIS_DIR")
WORKSPACE_DIR="$(dirname "$ROOT_DIR")"

. "$THIS_DIR/kash/kash.sh"

## Parse options
##

DEFAULT_NODE_VER=20
DEFAULT_DEBIAN_VER=bookworm
NODE_VER=$DEFAULT_NODE_VER
DEBIAN_VER=$DEFAULT_DEBIAN_VER
PUBLISH=false
CI_STEP_NAME="Build app"
while getopts "d:n:pr:" option; do
    case $option in
        d) # defines debian version
            DEBIAN_VER=$OPTARG
            ;;
        n) # defines node version
            NODE_VER=$OPTARG
             ;;
        p) # publish app
            PUBLISH=true
            ;;
        r) # report outcome to slack
            CI_STEP_NAME=$OPTARG
            load_env_files "$WORKSPACE_DIR/development/common/SLACK_WEBHOOK_JOBS.enc.env"
            trap 'slack_ci_report "$ROOT_DIR" "$CI_STEP_NAME" "$?" "$SLACK_WEBHOOK_JOBS"' EXIT
            ;;
        *)
            ;;
    esac
done

## Init workspace
##

init_lib_infos "$ROOT_DIR"

APP=$(get_lib_name)
# Remove @kalisio prefix in module name
MODULE=${APP//"@kalisio"/}
VERSION=$(get_lib_version)
GIT_TAG=$(get_lib_tag)

load_env_files "$WORKSPACE_DIR/development/common/kalisio_dockerhub.enc.env"
load_value_files "$WORKSPACE_DIR/development/common/KALISIO_DOCKERHUB_PASSWORD.enc.value"

## Build container
##

# Remove trailing @ in module name
IMAGE_NAME="$KALISIO_DOCKERHUB_URL/${APP:1}"
if [[ -z "$GIT_TAG" ]]; then
    KRAWLER_TAG="latest"
else
    KRAWLER_TAG="$VERSION"
fi
IMAGE_TAG="$KRAWLER_TAG-node$NODE_VER-$DEBIAN_VER"

begin_group "Building container $IMAGE_NAME:$IMAGE_TAG ..."

docker login --username "$KALISIO_DOCKERHUB_USERNAME" --password-stdin "$KALISIO_DOCKERHUB_URL" < "$KALISIO_DOCKERHUB_PASSWORD"
# DOCKER_BUILDKIT is here to be able to use Dockerfile specific dockerginore (app.Dockerfile.dockerignore)
DOCKER_BUILDKIT=1 docker build -f dockerfile \
    --build-arg NODE_VERSION="$NODE_VER" \
    --build-arg DEBIAN_VERSION="$DEBIAN_VER" \
    -t "$IMAGE_NAME:$IMAGE_TAG" \
    "$WORKSPACE_DIR/$MODULE"

if [ "$PUBLISH" = true ]; then
    docker push "$IMAGE_NAME:$IMAGE_TAG"
    if [ "$NODE_VER" = "$DEFAULT_NODE_VER" ] && [ "$DEBIAN_VER" = "$DEFAULT_DEBIAN_VER" ]; then
        # Create alias as well for default versions
        docker tag "$IMAGE_NAME:$IMAGE_TAG" "$IMAGE_NAME:$KRAWLER_TAG"
        docker push "$IMAGE_NAME:$KRAWLER_TAG"
    fi
fi

docker logout "$KALISIO_DOCKERHUB_URL"

end_group "Building container $IMAGE_NAME:$IMAGE_TAG ..."
