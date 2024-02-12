#!/usr/bin/env bash
set -euo pipefail
# set -x

THIS_FILE=$(readlink -f "${BASH_SOURCE[0]}")
THIS_PATH=$(dirname "$THIS_FILE")
ROOT_PATH=$(dirname "$THIS_PATH")

. "$THIS_PATH/kash/kash.sh"

NODE_VER=16
MONGO_VER=4
while getopts "m:n:" option; do
    case $option in
        m) # defines mongo version
            MONGO_VER=$OPTARG;;
        n) # defines node version
            NODE_VER=$OPTARG;;
        *)
            ;;
    esac
done

use_node "$NODE_VER"

# Check KALISIO_DEVELOPMENT_DIR is defined (dev) or not (ci)
if [ "$CI" = true ]; then
    begin_group "Fetching project dependencies ..."

    KALISIO_DEVELOPMENT_DIR="$TMP_PATH/kalisio"
    mkdir -p "$KALISIO_DEVELOPMENT_DIR"

    # clone developement into $KALISIO_DEVELOPMENT_DIR
    git clone --depth 1 "https://$GITHUB_DEVELOPMENT_PAT@github.com/kalisio/development.git" "$KALISIO_DEVELOPMENT_DIR/development"

    # Setup KDK
    cd "$ROOT_PATH"
    yarn install

    # and other dependencies
    for pkg in \
        feathers-distributed \
        feathers-s3 \
        feathers-import-export \
        feathers-webpush; do
        git clone --depth 1 "https://github.com/kalisio/$pkg" "$KALISIO_DEVELOPMENT_DIR/$pkg"
        cd "$KALISIO_DEVELOPMENT_DIR/$pkg"
        yarn install
        yarn link
        cd "$ROOT_PATH"
        yarn link "@kalisio/$pkg"
    done

    cd "$KALISIO_DEVELOPMENT_DIR/feathers-import-export"
    yarn link @kalisio/feathers-s3

    git clone --depth 1 "https://github.com/weacast/weacast" "$KALISIO_DEVELOPMENT_DIR/weacast"
    cd "$KALISIO_DEVELOPMENT_DIR/weacast"
    yarn install
    for pkg in core gfs probe; do
        cd "$KALISIO_DEVELOPMENT_DIR/weacast/packages/$pkg"
        yarn link
        cd "$ROOT_PATH"
        yarn link "@weacast/$pkg"
    done

    cd "$ROOT_PATH"

    end_group "Fetching project dependencies ..."

    use_mongo "$MONGO_VER"
fi

# Start mongo
k-mongo

## Load project env
##

. "$KALISIO_DEVELOPMENT_DIR/development/workspaces/libs/libs.sh" kdk

## Run tests
##

if [ "$CI" = true ]; then
    cc-test-reporter before-build
    set +e
fi

yarn test
TEST_RESULT=$?

if [ "$CI" = true ]; then
    set -e
    cc-test-reporter after-build --exit-code $TEST_RESULT
fi
