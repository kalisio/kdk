#!/usr/bin/env bash
set -euo pipefail
set -x

THIS_FILE=$(readlink -f "${BASH_SOURCE[0]}")
THIS_PATH=$(dirname "$THIS_FILE")
ROOT_PATH=$(dirname "$THIS_PATH")

. "$THIS_PATH/lib.sh"

# vitepress version requires node 18
use_node 18

cd "$ROOT_PATH/docs" && yarn install && yarn build

deploy_gh_pages "$ROOT_PATH" "$ROOT_PATH/docs/.vitepress/dist"
