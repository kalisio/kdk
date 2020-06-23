#!/bin/bash

# Build testcafe
if [ $1 == "testcafe" ]; then
  TESTCAFE_VERSION=1.8.6
  TESTCAFE_VUE_SELECTORS_VERSION=3.1.0
  TESTCAFE_MONGODB_DRIVER_VERSION=3.1.4
  pushd extras/testcafe
  docker build --force-rm --build-arg TESTCAFE_VERSION=$TESTCAFE_VERSION --build-arg TESTCAFE_VUE_SELECTORS_VERSION=$TESTCAFE_VUE_SELECTORS_VERSION --build-arg MONGDODB_DRIVER_VERSION=$TESTCAFE_MONGODB_DRIVER_VERSION -t kalisio/testcafe:$TESTCAFE_VERSION .
  RESULT_CODE=$?
  if [ $RESULT_CODE -ne 0 ]; then
    echo "testcafe generation failed [error: $RESULT_CODE]"
    exit 1
  fi
  docker login -u="$DOCKER_USER" -p="$DOCKER_PASSWORD"
  docker push kalisio/testcafe:$TESTCAFE_VERSION
  popd
fi
