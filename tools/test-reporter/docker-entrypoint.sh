#!/bin/sh

# Initialize code climate
./cc-test-reporter before-build

cd /opt/kdk/$APP
yarn test:server
ERROR_CODE=$?
	
# Report to code climate
./cc-test-reporter after-build -t lcov --exit-code $ERROR_CODE