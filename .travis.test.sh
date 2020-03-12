#!/bin/bash

# Clone the workspace 
echo -e "machine github.com\n  login $GITHUB_TOKEN" > ~/.netrc
git clone https://github.com/kalisio/kdk-workspaces workspace

# Read extra environment variables (merges common and flavor env)
cp workspace/common/.env .env
if [ -f workspace/$FLAVOR/.env ]; then
  echo merging $FLAVOR/.env file with common .env
  cat workspace/$FLAVOR/.env >> .env
fi

set -a
. .env
set +a

yarn mocha

