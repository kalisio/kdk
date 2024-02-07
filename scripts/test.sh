#!/usr/bin/env bash
set -euo pipefail
# set -x

THIS_FILE=$(readlink -f "${BASH_SOURCE[0]}")
THIS_PATH=$(dirname "$THIS_FILE")
ROOT_PATH=$(dirname "$THIS_PATH")

ci_requirements() {
    if [ "${GITHUB_ACTIONS:-}" = true ]; then
        # ci-kdk container has no java installed
        sudo apt-get update && sudo apt-get --no-install--recommends --yes install default-jre

        # Start ci mongo
        mongod --dbpath /var/lib/mongo --logpath /var/log/mongodb/mongod.log --fork
    # elif [ "${GITLAB_CI:-}" = true ]; then
    # elif [  "${TRAVIS:-}" = true ]; then
    fi
}

begin_group() {
    TITLE="$1"
    if [ "${GITHUB_ACTIONS:-}" = true ]; then
        # see https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#grouping-log-lines
        echo "::group::$TITLE"
    elif [ "${GITLAB_CI:-}" = true ]; then
        # see https://docs.gitlab.com/ee/ci/jobs/#custom-collapsible-sections
        echo -e "\e[0Ksection_start:$(date +%s):$TITLE\r\e[0KHeader of the 1st collapsible section"
    elif [  "${TRAVIS:-}" = true ]; then
        # see
        echo "travis_fold:start:$TITLE"
    fi
}

end_group() {
    TITLE="$1"
    if [ "${GITHUB_ACTIONS:-}" = true ]; then
        echo "::endgroup::"
    elif [ "${GITLAB_CI:-}" = true ]; then
        echo -e "\e[0Ksection_end:$(date +%s):$TITLE\r\e[0K"
    elif [  "${TRAVIS:-}" = true ]; then
        echo "travis_fold:end:$TITLE"
    fi
}

# Check KALISIO_DEVELOPMENT_DIR is defined (dev) or not (ci)
IS_CI=false
if [ -z "${KALISIO_DEVELOPMENT_DIR:-}" ]; then
    IS_CI=true
    echo "Running in CI mode ..."

    begin_group "Setting up CI ..."
    ci_requirements
    end_group "Setting up CI ..."

    begin_group "Fetching project dependencies ..."

    KALISIO_DEVELOPMENT_DIR=$(mktemp -d -p "${XDG_RUNTIME_DIR:-}" kalisio.XXXXXX)
    # clone developement into $KALISIO_DEVELOPMENT_DIR
    git clone --depth 1 "https://$GITHUB_DEVELOPMENT_PAT@github.com/kalisio/development.git" "$KALISIO_DEVELOPMENT_DIR/development"

    # Setup KDK
    cd "$ROOT_PATH"
    yarn install

    # and other dependencies
    for pkg in \
        feathers-distributed \
        feathers-s3 \
        feathers-import-export \
        feathers-webpush; do
        git clone --depth 1 "https://github.com/kalisio/$pkg" "$KALISIO_DEVELOPMENT_DIR/$pkg"
        cd "$KALISIO_DEVELOPMENT_DIR/$pkg"
        yarn install
        yarn link
        cd "$ROOT_PATH"
        yarn link "@kalisio/$pkg"
    done

    cd "$KALISIO_DEVELOPMENT_DIR/feathers-import-export"
    yarn link @kalisio/feathers-s3

    git clone --depth 1 "https://github.com/weacast/weacast" "$KALISIO_DEVELOPMENT_DIR/weacast"
    cd "$KALISIO_DEVELOPMENT_DIR/weacast"
    yarn install
    for pkg in core gfs probe; do
        cd "$KALISIO_DEVELOPMENT_DIR/weacast/packages/$pkg"
        yarn link
        cd "$ROOT_PATH"
        yarn link "@weacast/$pkg"
    done

    cd "$ROOT_PATH"

    end_group "Fetching project dependencies ..."
else
    # Start mongo
    k-mongo
fi

## Load project env
##

. "$KALISIO_DEVELOPMENT_DIR/development/workspaces/libs/libs.sh" kdk

## Run tests
##

if [ "$IS_CI" = true ]; then
    cc-test-reporter before-build
    set +e
fi

yarn test
TEST_RESULT=$?

if [ "$IS_CI" = true ]; then
    set -e
    cc-test-reporter after-build --exit-code $TEST_RESULT
fi
