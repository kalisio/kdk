#!/bin/bash

check_code()
{
   if [ $1 -eq 1 ]; then
	  echo "$2 has failed [error: $1]"
	  exit 1
  fi
}

echo -e "machine github.com\n  login $GITHUB_TOKEN" > ~/.netrc

# Setup KDK
yarn install

# Clone others direct dependencies we'd like to use for testing
git clone https://github.com/kalisio/feathers-distributed && cd feathers-distributed && yarn install && yarn link && cd ..
yarn link @kalisio/feathers-distributed

git clone https://github.com/kalisio/feathers-s3 && cd feathers-s3 && yarn install && yarn link && cd ..
yarn link @kalisio/feathers-s3

git clone https://github.com/kalisio/feathers-import-export && cd feathers-import-export && yarn install && yarn link && cd ..
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
source development/workspaces/libs/libs.sh feathers-s3

# Run the test
yarn test
check_code $? "Running tests"
