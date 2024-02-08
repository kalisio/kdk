#!/usr/bin/env bash

### Host detection
###

IS_CI=false
CI_NAME=

if [ "${GITHUB_ACTIONS:-}" = true ]; then
    CI_NAME="github"

    # Add ~/.local/bin to PATH
    mkdir -p "$HOME/.local/bin"
    export PATH=$PATH:$HOME/.local/bin

    # If nvm is present, make it available
    if [ -d "$HOME/.nvm" ]; then
        . "$HOME/.nvm/nvm.sh"
    fi
elif [ "${GITLAB_CI:-}" = true ]; then
    CI_NAME="gitlab"
elif [  "${TRAVIS:-}" = true ]; then
    CI_NAME="travis"
fi


if [ -n "$CI_NAME" ]; then
    IS_CI=true
    echo "Running in CI mode ..."
fi

## requirements

YQ_VERSION=4.40.5
AGE_VERSION=1.1.1
SOPS_VERSION=3.8.1

NVM_VERSION=0.39.7
NODE16_VERSION=16.20.2
NODE18_VERSION=18.19.0

# MONGODB4_VERSION=debian10-4.4.28
# MONGODB5_VERSION=debian11-5.0.24

if [ -n "${RUNNER_TEMP:-}" ]; then # RUNNER_TEMP is Github Action specific
    TMP_PATH="$(mktemp -d -p "$RUNNER_TEMP" kalisio.XXXXXX)"
else
    TMP_PATH="$(mktemp -d -p "${XDG_RUNTIME_DIR:-}" kalisio.XXXXXX)"
fi

TMP_DL_PATH="$TMP_PATH/dl"

install_yq() {
    local DL_PATH="$TMP_DL_PATH/yq"
    mkdir -p "$DL_PATH" && cd "$DL_PATH"
    curl -OLsS https://github.com/mikefarah/yq/releases/download/v${YQ_VERSION}/yq_linux_amd64.tar.gz
    # checksum has to be extracted from custom file ...
    curl -OLsS https://github.com/mikefarah/yq/releases/download/v${YQ_VERSION}/checksums
    curl -OLsS https://github.com/mikefarah/yq/releases/download/v${YQ_VERSION}/checksums_hashes_order
    curl -OLsS https://github.com/mikefarah/yq/releases/download/v${YQ_VERSION}/extract-checksum.sh
    chmod u+x extract-checksum.sh
    ./extract-checksum.sh "SHA-256" "yq_linux_amd64.tar.gz" | awk '{ print $2 " " $1}' | sha256sum --check
    tar xf yq_linux_amd64.tar.gz
    mv yq_linux_amd64 ~/.local/bin/yq
    chmod u+x ~/.local/bin/yq
    cd ~-
}

install_age() {
    # NOTE: available with sudo apt-get install age on bookworm

    local DL_PATH="$TMP_DL_PATH/age"
    mkdir -p "$DL_PATH" && cd "$DL_PATH"
    curl -OLsS https://github.com/FiloSottile/age/releases/download/v${AGE_VERSION}/age-v${AGE_VERSION}-linux-amd64.tar.gz
    # no checksum ...
    tar xf age-v${AGE_VERSION}-linux-amd64.tar.gz
    cp age/age ~/.local/bin
    cp age/age-keygen ~/.local/bin
    cd ~-
}

install_sops() {
    local DL_PATH="$TMP_DL_PATH/sops"
    mkdir -p "$DL_PATH" && cd "$DL_PATH"
    curl -OLsS https://github.com/getsops/sops/releases/download/v${SOPS_VERSION}/sops-v${SOPS_VERSION}.linux.amd64
    curl -OLsS https://github.com/getsops/sops/releases/download/v${SOPS_VERSION}/sops-v${SOPS_VERSION}.checksums.txt
    sha256sum --ignore-missing --quiet -c sops-v${SOPS_VERSION}.checksums.txt
    cp sops-v${SOPS_VERSION}.linux.amd64 ~/.local/bin/sops
    chmod u+x ~/.local/bin/sops
    cd ~-
}

install_cc_test_reporter() {
    local DL_PATH="$TMP_DL_PATH/cc"
    mkdir -p "$DL_PATH" && cd "$DL_PATH"
    curl -OLsS https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64
    curl -OLsS https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64.sha256
    sha256sum --ignore-missing --quiet -c test-reporter-latest-linux-amd64.sha256
    cp test-reporter-latest-linux-amd64 /usr/local/bin/cc-test-reporter
    chmod +x /usr/local/bin/cc-test-reporter
    cd ~-
}

install_nvm() {
    local DL_PATH="$TMP_DL_PATH/nvm"
    mkdir -p "$DL_PATH" && cd "$DL_PATH"
    curl -OLsS https://raw.githubusercontent.com/nvm-sh/nvm/v${NVM_VERSION}/install.sh
    bash ./install.sh
    cd ~-
}

install_node16() {
    bash -i -c "nvm install ${NODE16_VERSION} && npm install --global yarn"
}

install_node18() {
    bash -i -c "nvm install ${NODE18_VERSION} && npm install --global yarn"
}

# install_node16() {
#     local DL_PATH="$TMP_PATH/node16"
#     mkdir -p "$DL_PATH" && cd "$DL_PATH"
#     curl -OLsS https://nodejs.org/dist/v${NODE16_VERSION}/node-v${NODE16_VERSION}-linux-x64.tar.xz
#     curl -OLsS https://nodejs.org/dist/v${NODE16_VERSION}/SHASUMS256.txt
#     sha256sum --ignore-missing --quiet -c SHASUMS256.txt
#     tar xf node-v${NODE16_VERSION}-linux-x64.tar.xz
#     cp -fR node-v${NODE16_VERSION}-linux-x64/bin /usr/local
#     cp -fR node-v${NODE16_VERSION}-linux-x64/lib /usr/local
#     cp -fR node-v${NODE16_VERSION}-linux-x64/share /usr/local
#     npm install --global yarn
#     cd ~-
# }

install_mongo4() {
    # MONGODB4_VERSION=debian10-4.4.28
    MONGODB4_VERSION=ubuntu2004-4.4.28

    local DL_PATH="$TMP_DL_PATH/mongo4"
    mkdir -p "$DL_PATH" && cd "$DL_PATH"
    # curl -OLsS http://ftp.us.debian.org/debian/pool/main/o/openssl/libssl1.1_1.1.1w-0+deb11u1_amd64.deb
    # DEBIAN_FRONTEND=noninteractive && dpkg -i libssl1.1_1.1.1w-0+deb11u1_amd64.deb
    curl -OLsS http://security.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2.21_amd64.deb
    DEBIAN_FRONTEND=noninteractive && sudo dpkg -i libssl1.1_1.1.1f-1ubuntu2.21_amd64.deb
    curl -OLsS https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-${MONGODB4_VERSION}.tgz
    tar xf mongodb-linux-x86_64-${MONGODB4_VERSION}.tgz
    mkdir -p ~/.local/bin/mongo4
    cp -fR mongodb-linux-x86_64-${MONGODB4_VERSION}/bin/mongo ~/.local/bin/mongo4
    cp -fR mongodb-linux-x86_64-${MONGODB4_VERSION}/bin/mongod ~/.local/bin/mongo4
    sudo mkdir -p /var/lib/mongo && sudo mkdir -p /var/log/mongodb
    sudo chmod a+rwx /var/lib/mongo && sudo chmod a+rwx /var/log/mongodb
    cd ~-

    # Run mongodb like this:
    # mongod --dbpath /var/lib/mongo --logpath /var/log/mongodb/mongod.log --fork
}

# mongo5/ubuntu
# https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2004-5.0.24.tgz
# http://security.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2.21_amd64.deb
# mongo5/debian
# debian11-5.0.24
# http://ftp.us.debian.org/debian/pool/main/o/openssl/libssl1.1_1.1.1w-0+deb11u1_amd64.deb

install_cleanup() {
    rm -fR "$TMP_DL_PATH"
}

use_mongo4() {
    ln -sf ~/.loca/bin/mongo4/mongo ~/.local/bin
    ln -sf ~/.loca/bin/mongo4/mongod ~/.local/bin
}

use_mongo5() {
    ln -sf ~/.loca/bin/mongo5/mongo ~/.local/bin
    ln -sf ~/.loca/bin/mongo5/mongod ~/.local/bin
}

## log

begin_group() {
    TITLE="$1"

    if [ "$CI_NAME" = "github" ]; then
        # see https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#grouping-log-lines
        echo "::group::$TITLE"
    elif [ "$CI_NAME" = "gitlab" ]; then
        # see https://docs.gitlab.com/ee/ci/jobs/#custom-collapsible-sections
        echo -e "\e[0Ksection_start:$(date +%s):$TITLE\r\e[0KHeader of the 1st collapsible section"
    elif [ "$CI_NAME" = "travis" ]; then
        # see
        echo "travis_fold:start:$TITLE"
    fi
}

end_group() {
    TITLE="$1"

    if [ "$CI_NAME" = "github" ]; then
        echo "::endgroup::"
    elif [ "$CI_NAME" = "gitlab" ]; then
        echo -e "\e[0Ksection_end:$(date +%s):$TITLE\r\e[0K"
    elif [ "$CI_NAME" = "travis" ]; then
        echo "travis_fold:end:$TITLE"
    fi
}

