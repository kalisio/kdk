#!/bin/bash

check_code()
{
   if [ $1 -eq 1 ]; then
	  echo "$2 has failed [error: $1]"
	  exit 1
  fi
}

# Clone the workspace 
echo -e "machine github.com\n  login $GITHUB_TOKEN" > ~/.netrc
git clone https://github.com/kalisio/kdk-workspaces workspace

git clone -b v1.0.5 https://github.com/kalisio/feathers-distributed && cd feathers-distributed && yarn install && yarn link && cd ..
yarn link @kalisio/feathers-distributed

git clone https://github.com/weacast/weacast-core && cd weacast-core && yarn install && yarn link && cd ..
yarn link weacast-core

# Read extra environment variables (merges common and flavor env)
cp workspace/.env .env
set -a
. .env
set +a

yarn test
check_code $? "Running tests"



