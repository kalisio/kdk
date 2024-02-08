#!/usr/bin/env bash
set -euo pipefail
set -x

THIS_FILE=$(readlink -f "${BASH_SOURCE[0]}")
THIS_PATH=$(dirname "$THIS_FILE")
ROOT_PATH=$(dirname "$THIS_PATH")

. "$THIS_PATH/lib.sh"

begin_group "Normalizing GHA"

install_yq
install_age
install_sops
install_nvm
install_node16
install_node18
install_mongo4
install_cleanup

sudo apt-get update && sudo apt-get --no-install-recommends --yes install default-jre

end_group "Normalizing GHA"
