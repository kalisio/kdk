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
OPT_LIST="n:k:"

while getopts "$OPT_LIST" OPT; do
    case $OPT in
        n) # defines node version
            WORKSPACE_NODE=$OPTARG;;
        k) # workspace kind (nokli kli klifull)
            WORKSPACE_KIND=$OPTARG;;
        *)
        ;;
    esac
done

begin_group "Setting up workspace ..."

if [ "$CI" != true ]; then
    while getopts "b:t" option; do
        case $option in
            b) # defines branch
                WORKSPACE_BRANCH=$OPTARG;;
            t) # defines tag
                WORKSPACE_TAG=$OPTARG;;
            *)
            ;;
        esac
    done

    shift $((OPTIND-1))
    WORKSPACE_DIR="$1"

    # Clone project in the workspace
    git_shallow_clone "$KALISIO_GITHUB_URL/kalisio/kdk.git" "$WORKSPACE_DIR/kdk" "${WORKSPACE_TAG:-${WORKSPACE_BRANCH:-}}"

    # unset KALISIO_DEVELOPMENT_DIR because we want kli to clone everyhting in $WORKSPACE_DIR
    unset KALISIO_DEVELOPMENT_DIR
fi

setup_lib_workspace "$WORKSPACE_DIR" "$KALISIO_GITHUB_URL/kalisio/development.git"

if [ "$WORKSPACE_KIND" != "nokli" ]; then
    run_kli "$WORKSPACE_DIR" "$WORKSPACE_NODE" "$WORKSPACE_DIR/development/workspaces/libs/kdk/dev/kdk.cjs" "$WORKSPACE_KIND"
fi

end_group "Setting up workspace ..."
