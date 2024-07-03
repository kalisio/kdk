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
MONGO_VER=7
CI_STEP_NAME="Run tests"
CODE_COVERAGE=false
while getopts "m:n:cr:" option; do
    case $option in
        m) # defines mongo version
            MONGO_VER=$OPTARG
            ;;    
        n) # defines node version
            NODE_VER=$OPTARG
             ;;
        c) # publish code coverage
            CODE_COVERAGE=true
            ;;
        r) # report outcome to slack
            CI_STEP_NAME=$OPTARG        
            load_env_files "$WORKSPACE_DIR/development/common/SLACK_WEBHOOK_LIBS.enc.env"
            trap 'slack_ci_report "$ROOT_DIR" "$CI_STEP_NAME" "$?" "$SLACK_WEBHOOK_LIBS"' EXIT
            ;;
        *)
            ;;
    esac
done

## Init workspace
##

run_kli "$WORKSPACE_DIR" "$NODE_VER" "$WORKSPACE_DIR/development/workspaces/libs/kdk/dev/kdk.cjs" klifull

. "$WORKSPACE_DIR/development/workspaces/libs/libs.sh" kdk

## Run tests
##

run_lib_tests "$ROOT_DIR" "$CODE_COVERAGE" "$NODE_VER" "$MONGO_VER"
