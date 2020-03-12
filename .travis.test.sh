#!/bin/bash

# Clone the workspace 
echo -e "machine github.com\n  login $GITHUB_TOKEN" > ~/.netrc
git clone https://github.com/kalisio/kdk-workspaces workspace

# Read extra environment variables (merges common and flavor env)
cp workspace/.env .env
set -a
. .env
set +a

yarn mocha

