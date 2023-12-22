#!/bin/bash

check_code()
{
   if [ $1 -eq 1 ]; then
      echo "$2 has failed [error: $1]"
      exit 1
  fi
}

AGE_VERSION=1.1.1
SOPS_VERSION=3.8.1
TMP_PATH="$(mktemp -d -p "${XDG_RUNTIME_DIR:-}" kalisio.XXXXXX)"

install_age() {
    local DL_PATH="$TMP_PATH/age"
    mkdir "$DL_PATH" && pushd "$DL_PATH" || exit
    wget -q https://github.com/FiloSottile/age/releases/download/v${AGE_VERSION}/age-v${AGE_VERSION}-linux-amd64.tar.gz
    # no checksum ...
    tar xf age-v${AGE_VERSION}-linux-amd64.tar.gz
    cp age/age "$HOME/.local/bin"
    popd || exit
}

install_sops() {
    local DL_PATH="$TMP_PATH/sops"
    mkdir "$DL_PATH" && pushd "$DL_PATH" || exit
    wget -q https://github.com/getsops/sops/releases/download/v${SOPS_VERSION}/sops-v${SOPS_VERSION}.linux.amd64
    wget -q https://github.com/getsops/sops/releases/download/v${SOPS_VERSION}/sops-v${SOPS_VERSION}.checksums.txt
    sha256sum --ignore-missing --quiet -c sops-v${SOPS_VERSION}.checksums.txt
    cp sops-v${SOPS_VERSION}.linux.amd64 "$HOME/.local/bin/sops"
    chmod a+x "$HOME/.local/bin/sops"
    popd || exit
}

echo "$HOME"
echo "$PATH"
echo "$(whoami)"

mkdir -p $HOME/.local/bin
install_age
install_sops
export PATH="$PATH:$HOME/.local/bin"

echo -e "machine github.com\n  login $GITHUB_TOKEN" > ~/.netrc

# Setup KDK
yarn install

# Clone others direct dependencies we'd like to use for testing
git clone https://github.com/kalisio/feathers-distributed && cd feathers-distributed && yarn install && yarn link && cd ..
yarn link @kalisio/feathers-distributed

git clone https://github.com/kalisio/feathers-s3 && cd feathers-s3 && yarn install && yarn link && cd ..
yarn link @kalisio/feathers-s3

git clone https://github.com/kalisio/feathers-import-export && cd feathers-import-export && yarn install && yarn link && yarn link @kalisio/feathers-s3 && cd ..
yarn link @kalisio/feathers-import-export

git clone https://github.com/kalisio/feathers-webpush && cd feathers-webpush && yarn install && yarn link && cd ..
yarn link @kalisio/feathers-webpush

git clone https://github.com/weacast/weacast && cd weacast && yarn install && cd packages
cd core && yarn link && cd .. && cd gfs && yarn link && cd .. && cd probe && yarn link && cd ..
cd ../..
yarn link @weacast/core
yarn link @weacast/gfs
yarn link @weacast/probe

# Clone the development project and configure the env
git clone https://oauth2:$GITHUB_TOKEN@github.com/kalisio/development.git "development"
source development/workspaces/libs/libs.sh kdk

# Run the test
yarn test
check_code $? "Running tests"
