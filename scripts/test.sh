#!/usr/bin/env bash
set -euo pipefail
# set -x

THIS_FILE=$(readlink -f "${BASH_SOURCE[0]}")
THIS_PATH=$(dirname "$THIS_FILE")
ROOT_PATH=$(dirname "$THIS_PATH")

# Check KALISIO_DEVELOPMENT_DIR is defined (dev) or not (ci)
if [ -z "${KALISIO_DEVELOPMENT_DIR:-}" ]; then
    KALISIO_DEVELOPMENT_DIR=$(mktemp -d -p "${XDG_RUNTIME_DIR:-}" kalisio.XXXXXX)
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
        cd ~-
        yarn link "@kalisio/$pkg"
    done

    git clone --depth 1 "https://github.com/weacast/weacast" "$KALISIO_DEVELOPMENT_DIR/weacast"
    cd "$KALISIO_DEVELOPMENT_DIR/weacast"
    yarn install
    for pkg in core gfs probe; do
        cd "packages/$pkg"
        yarn link
        cd ~-
        yarn link "@weacast/$pkg"
    done

    # Start ci mongo
    mongod --dbpath /var/lib/mongo --logpath /var/log/mongodb/mongod.log --fork
else
    # Start mongo
    k-mongo
fi

## Load project env
##

. "$KALISIO_DEVELOPMENT_DIR/development/workspaces/libs/libs.sh" kdk

## Run tests
##

yarn test
