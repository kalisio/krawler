#!/usr/bin/env bash
set -euo pipefail
# set -x

THIS_FILE=$(readlink -f "${BASH_SOURCE[0]}")
THIS_DIR=$(dirname "$THIS_FILE")
ROOT_DIR=$(dirname "$THIS_DIR")

. "$THIS_DIR/kash/kash.sh"

## Parse options
##

PUBLISH=false
CI_STEP_NAME="Build docs"
while getopts "pr:" OPT; do
    case $OPT in
        p) # publish doc
            PUBLISH=true
            ;;
        r) # report outcome to slack
            CI_STEP_NAME=$OPTARG
            trap 'slack_ci_report "$ROOT_DIR" "$CI_STEP_NAME" "$?" "$SLACK_WEBHOOK_JOBS"' EXIT
            ;;
        *)
            ;;
    esac
done

## Init workspace
##

WORKSPACE_DIR="$(dirname "$ROOT_DIR")"

load_env_files "$WORKSPACE_DIR/development/common/SLACK_WEBHOOK_JOBS.enc.env"

## Build docs
##

# Build process requires node 18
use_node 18

rm -f .postcssrc.js && cd docs && yarn install && yarn build

if [ "$PUBLISH" = true ]; then
    load_env_files "$WORKSPACE_DIR/development/common/GH_PAGES_PUSH_TOKEN.enc.env"

    COMMIT_SHA=$(get_git_commit_sha "$ROOT_DIR")
    COMMIT_AUTHOR_NAME=$(get_git_commit_author_name "$ROOT_DIR")
    COMMIT_AUTHOR_EMAIL=$(get_git_commit_author_email "$ROOT_DIR")
    deploy_gh_pages \
        "https://oauth2:$GH_PAGES_PUSH_TOKEN@github.com/kalisio/krawler.git" \
        "$ROOT_DIR/docs/.vitepress/dist" \
        "$COMMIT_AUTHOR_NAME" \
        "$COMMIT_AUTHOR_EMAIL" \
        "Docs built from $COMMIT_SHA"
fi
