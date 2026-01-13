#!/usr/bin/env bash
set -euo pipefail
#set -x

THIS_FILE=$(readlink -f "${BASH_SOURCE[0]}")
THIS_DIR=$(dirname "$THIS_FILE")
ROOT_DIR=$(dirname "$THIS_DIR")
WORKSPACE_DIR="$(dirname "$ROOT_DIR")"

. "$THIS_DIR/kash/kash.sh"

## Parse options
##

WORKSPACE_NODE=20
WORKSPACE_KIND=klifull
WORKSPACE_BRANCH=
WORKSPACE_TAG=
OPT_LIST="n:k:"
if [ "$CI" != true ]; then
    OPT_LIST="b:n:t:k:"
else
    WORKSPACE_BRANCH=$(get_git_branch "$ROOT_DIR")
    WORKSPACE_TAG=$(get_git_tag "$ROOT_DIR")
fi

while getopts "$OPT_LIST" OPT; do
    case $OPT in
        n) # defines node version
            WORKSPACE_NODE=$OPTARG;;
        k) # workspace kind (nokli kli klifull)
            WORKSPACE_KIND=$OPTARG;;
        b) # defines branch
            WORKSPACE_BRANCH=$OPTARG;;
        t) # defines tag
            WORKSPACE_TAG=$OPTARG;;
        *)
        ;;
    esac
done

begin_group "Setting up workspace ..."

WORKSPACE_REF="${WORKSPACE_TAG:-${WORKSPACE_BRANCH:-}}"

if [ "$CI" != true ]; then
    shift $((OPTIND-1))
    WORKSPACE_DIR="$1"

    # Clone project in the workspace
    git_shallow_clone "$KALISIO_GITHUB_URL/kalisio/kdk.git" "$WORKSPACE_DIR/kdk" "$WORKSPACE_REF"

    # unset KALISIO_DEVELOPMENT_DIR because we want kli to clone everyhting in $WORKSPACE_DIR
    unset KALISIO_DEVELOPMENT_DIR
fi

setup_lib_workspace "$WORKSPACE_DIR" "$KALISIO_GITHUB_URL/kalisio/development.git"

# Only use kli when requested + on master branch
# otherwise package.json version will be used
if [ "$WORKSPACE_KIND" != "nokli" ]; then
    # On master branch we use kli, on other branches / tags we just yarn install
    if [ "$WORKSPACE_REF" = "master" ]; then
        run_kli "$WORKSPACE_DIR" "$WORKSPACE_NODE" "$WORKSPACE_DIR/development/workspaces/libs/kdk/dev/kdk.cjs" "$WORKSPACE_KIND"
    else
        cd "$WORKSPACE_DIR/kdk" && nvm exec "$WORKSPACE_NODE" yarn install && cd ~-
    fi
fi

end_group "Setting up workspace ..."
