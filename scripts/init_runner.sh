#!/usr/bin/env bash
set -euo pipefail
# set -x

JOB_ID=$1

THIS_FILE=$(readlink -f "${BASH_SOURCE[0]}")
THIS_PATH=$(dirname "$THIS_FILE")
ROOT_PATH=$(dirname "$THIS_PATH")

. "$THIS_PATH/kash/kash.sh"

### Github Actions

init_github_run_tests() {
    install_reqs yq age sops nvm node16 node18 node20 mongo4 mongo5 mongo6 cc_test_reporter
    sudo apt-get update && sudo apt-get --no-install-recommends --yes install default-jre
}

init_github_publish_docs() {
    install_reqs nvm node18
}

begin_group "Init $CI_ID for $JOB_ID"

init_"${CI_ID}_${JOB_ID}"

end_group "Init $CI_ID for $JOB_ID"
