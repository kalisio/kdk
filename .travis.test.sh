#!/bin/bash

check_code()
{
   if [ $1 -eq 1 ]; then
	  echo "$2 has failed [error: $1]"
	  exit 1
  fi
}

yarn install

# Clone the workspace 
echo -e "machine github.com\n  login $GITHUB_TOKEN" > ~/.netrc
git clone https://github.com/kalisio/kdk-workspaces workspace

git clone https://github.com/kalisio/feathers-distributed && cd feathers-distributed && yarn install && yarn link && cd ..
yarn link @kalisio/feathers-distributed

git clone https://github.com/weacast/weacast && cd weacast && yarn install && cd packages
cd core && yarn link && cd .. && cd gfs && yarn link && cd .. && cd probe && yarn link && cd ..
cd ../..
yarn link @weacast/core
yarn link @weacast/gfs
yarn link @weacast/probe

# Read extra environment variables (merges common and flavor env)
cp workspace/.env .env
set -a
. .env
set +a

yarn test
check_code $? "Running tests"
