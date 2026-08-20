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

NODE_VER=20
while getopts "n:" option; do
    case $option in
        n) # defines node version
            NODE_VER=$OPTARG
            ;;
        *)
            ;;
    esac
done

## Install vite client dependencies and build the client lib so client tests can run
##

use_node "$NODE_VER"

begin_group "Installing vite client dependencies ..."

cd "$ROOT_DIR/vite" && yarn install --frozen-lockfile && yarn fix-protomaps-leaflet

end_group "Installing vite client dependencies ..."

begin_group "Building client lib for tests ..."

cd "$ROOT_DIR/vite" && yarn build:lib:extras && yarn build:lib:debug

end_group "Building client lib for tests ..."
