#!/usr/bin/env bash

### Variables provided by this script
###   - TMP_PATH: a path where to write temp files
###   - OS_ID: debian or ubuntu or alpine ...
###   - OS_VERSION:
###   - CI: true or false
###   - CI_ID: github or gitlab or travis or empty (CI = false)

### Host detection
###

. /etc/os-release

OS_ID=$ID
OS_VERSION=$VERSION_ID

echo "Running on ${OS_ID}-${OS_VERSION}"

CI=false
CI_ID=

if [ "${GITHUB_ACTIONS:-}" = true ]; then
    CI_ID="github"

    # Add ~/.local/bin to PATH
    mkdir -p "$HOME/.local/bin"
    export PATH=$PATH:$HOME/.local/bin
elif [ "${GITLAB_CI:-}" = true ]; then
    CI_ID="gitlab"
elif [  "${TRAVIS:-}" = true ]; then
    CI_ID="travis"
fi

if [ -n "$CI_ID" ]; then
    CI=true
    echo "Running in CI mode ($CI_ID)..."

    # Emulate development k-mongo when running on CI
    cat <<EOF > ~/.local/bin/k-mongo
#!/usr/bin/env bash
mongod --dbpath /var/lib/mongo --logpath /var/log/mongodb/mongod.log --fork --port 27017
EOF
    chmod a+x ~/.local/bin/k-mongo
fi

# If nvm is present, make it available to script
if [ -d "$HOME/.nvm" ]; then
    . "$HOME/.nvm/nvm.sh"
fi

# Define a TMP_PATH to operate with temp files
if [ -n "${RUNNER_TEMP:-}" ]; then # RUNNER_TEMP is Github Action specific
    TMP_PATH="$RUNNER_TEMP"
else
    TMP_PATH="$(mktemp -d -p "${XDG_RUNTIME_DIR:-}" kalisio.XXXXXX)"
fi

### Requirements
###

YQ_VERSION=4.40.5
AGE_VERSION=1.1.1
SOPS_VERSION=3.8.1

NVM_VERSION=0.39.7
NODE16_VERSION=16.20.2
NODE18_VERSION=18.19.0

MONGODB4_VERSION=4.4.28
MONGODB5_VERSION=5.0.24

install_yq() {
    local DL_ROOT=$1
    local DL_PATH="$DL_ROOT/yq"
    if [ ! -d "$DL_PATH" ]; then
        mkdir -p "$DL_PATH" && cd "$DL_PATH"
        curl -OLsS https://github.com/mikefarah/yq/releases/download/v${YQ_VERSION}/yq_linux_amd64.tar.gz
        # checksum has to be extracted from custom file ...
        curl -OLsS https://github.com/mikefarah/yq/releases/download/v${YQ_VERSION}/checksums
        curl -OLsS https://github.com/mikefarah/yq/releases/download/v${YQ_VERSION}/checksums_hashes_order
        curl -OLsS https://github.com/mikefarah/yq/releases/download/v${YQ_VERSION}/extract-checksum.sh
        chmod u+x extract-checksum.sh
        ./extract-checksum.sh "SHA-256" "yq_linux_amd64.tar.gz" | awk '{ print $2 " " $1}' | sha256sum --check
    fi
    cd "$DL_PATH"
    tar xf yq_linux_amd64.tar.gz
    mv yq_linux_amd64 ~/.local/bin/yq
    chmod u+x ~/.local/bin/yq
    cd ~-
}

install_age() {
    local DL_ROOT=$1
    local DL_PATH="$DL_ROOT/age"
    if [ ! -d "$DL_PATH" ]; then
        mkdir -p "$DL_PATH" && cd "$DL_PATH"
        curl -OLsS https://github.com/FiloSottile/age/releases/download/v${AGE_VERSION}/age-v${AGE_VERSION}-linux-amd64.tar.gz
        # no checksum ...
    fi
    cd "$DL_PATH"
    tar xf age-v${AGE_VERSION}-linux-amd64.tar.gz
    cp age/age ~/.local/bin
    cp age/age-keygen ~/.local/bin
    cd ~-
}

install_sops() {
    local DL_ROOT=$1
    local DL_PATH="$DL_ROOT/sops"
    if [ ! -d "$DL_PATH" ]; then
        mkdir -p "$DL_PATH" && cd "$DL_PATH"
        curl -OLsS https://github.com/getsops/sops/releases/download/v${SOPS_VERSION}/sops-v${SOPS_VERSION}.linux.amd64
        curl -OLsS https://github.com/getsops/sops/releases/download/v${SOPS_VERSION}/sops-v${SOPS_VERSION}.checksums.txt
        sha256sum --ignore-missing --quiet -c sops-v${SOPS_VERSION}.checksums.txt
    fi
    cd "$DL_PATH"
    cp sops-v${SOPS_VERSION}.linux.amd64 ~/.local/bin/sops
    chmod u+x ~/.local/bin/sops
    cd ~-
}

install_cc_test_reporter() {
    local DL_ROOT=$1
    local DL_PATH="$DL_ROOT/cc"
    mkdir -p "$DL_PATH" && cd "$DL_PATH"
    curl -OLsS https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64
    curl -OLsS https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64.sha256
    sha256sum --ignore-missing --quiet -c test-reporter-latest-linux-amd64.sha256
    cp test-reporter-latest-linux-amd64 ~/.local/bin/cc-test-reporter
    chmod +x ~/.local/bin/cc-test-reporter
    cd ~-
}

install_nvm() {
    local DL_ROOT=$1
    local DL_PATH="$DL_ROOT/nvm"
    mkdir -p "$DL_PATH" && cd "$DL_PATH"
    curl -OLsS https://raw.githubusercontent.com/nvm-sh/nvm/v${NVM_VERSION}/install.sh
    bash ./install.sh
    # We always use yarn as package manager, so tell nvm to install it with every node installation
    # cf. https://github.com/nvm-sh/nvm?tab=readme-ov-file#default-global-packages-from-file-while-installing
    bash -i -c 'echo yarn >> $NVM_DIR/default-packages'
    cd ~-
}

install_node16() {
    bash -i -c "nvm install ${NODE16_VERSION}"
}

install_node18() {
    bash -i -c "nvm install ${NODE18_VERSION}"
}

install_mongo4() {
    local DL_ROOT=$1
    local DL_PATH="$DL_ROOT/mongo4"
    mkdir -p "$DL_PATH" && cd "$DL_PATH"
    case "$OS_ID" in
        debian)
            curl -OLsS http://ftp.us.debian.org/debian/pool/main/o/openssl/libssl1.1_1.1.1w-0+deb11u1_amd64.deb
            DEBIAN_FRONTEND=noninteractive && dpkg -i libssl1.1_1.1.1w-0+deb11u1_amd64.deb
            local MONGODB_SUFFIX=debian10-${MONGODB4_VERSION}
            ;;
        ubuntu)
            curl -OLsS http://security.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2.21_amd64.deb
            DEBIAN_FRONTEND=noninteractive && sudo dpkg -i libssl1.1_1.1.1f-1ubuntu2.21_amd64.deb
            local MONGODB_SUFFIX=ubuntu2004-${MONGODB4_VERSION}
            ;;
        *)
    esac

    curl -OLsS "https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-${MONGODB_SUFFIX}.tgz"
    tar xf "mongodb-linux-x86_64-${MONGODB_SUFFIX}.tgz"
    mkdir -p ~/.local/bin/mongo4
    cp -fR "mongodb-linux-x86_64-${MONGODB_SUFFIX}/bin/mongo" ~/.local/bin/mongo4
    cp -fR "mongodb-linux-x86_64-${MONGODB_SUFFIX}/bin/mongod" ~/.local/bin/mongo4
    sudo mkdir -p /var/lib/mongo4 && sudo mkdir -p /var/log/mongodb4
    sudo chmod a+rwx /var/lib/mongo4 && sudo chmod a+rwx /var/log/mongodb4
    cd ~-
}

install_mongo5() {
    local DL_ROOT=$1
    local DL_PATH="$DL_ROOT/mongo5"
    mkdir -p "$DL_PATH" && cd "$DL_PATH"
    case "$OS_ID" in
        debian)
            curl -OLsS http://ftp.us.debian.org/debian/pool/main/o/openssl/libssl1.1_1.1.1w-0+deb11u1_amd64.deb
            DEBIAN_FRONTEND=noninteractive && dpkg -i libssl1.1_1.1.1w-0+deb11u1_amd64.deb
            local MONGODB_SUFFIX=debian11-${MONGODB5_VERSION}
            ;;
        ubuntu)
            curl -OLsS http://security.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2.21_amd64.deb
            DEBIAN_FRONTEND=noninteractive && sudo dpkg -i libssl1.1_1.1.1f-1ubuntu2.21_amd64.deb
            local MONGODB_SUFFIX=ubuntu2004-${MONGODB5_VERSION}
            ;;
        *)
    esac

    curl -OLsS "https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-${MONGODB_SUFFIX}.tgz"
    tar xf "mongodb-linux-x86_64-${MONGODB_SUFFIX}.tgz"
    mkdir -p ~/.local/bin/mongo5
    cp -fR "mongodb-linux-x86_64-${MONGODB_SUFFIX}/bin/mongo" ~/.local/bin/mongo5
    cp -fR "mongodb-linux-x86_64-${MONGODB_SUFFIX}/bin/mongod" ~/.local/bin/mongo5
    sudo mkdir -p /var/lib/mongo5 && sudo mkdir -p /var/log/mongodb5
    sudo chmod a+rwx /var/lib/mongo5 && sudo chmod a+rwx /var/log/mongodb5
    cd ~-
}

install_reqs() {
    mkdir -p "$TMP_PATH/dl"

    for REQ in "$@"; do
        echo "Installing $REQ ..."
        install_"$REQ" "$TMP_PATH/dl"
    done
}

use_node() {
    local VERSION=$1

    nvm use "$VERSION"
}

use_mongo() {
    local VERSION=$1

    # Binaries
    ln -sf "$HOME/.local/bin/mongo$VERSION/mongo" ~/.local/bin
    ln -sf "$HOME/.local/bin/mongo$VERSION/mongod" ~/.local/bin
    # And working dirs
    sudo ln -sf "/var/lib/mongo$VERSION" /var/lib/mongo
    sudo ln -sf "/var/log/mongodb$VERSION" /var/log/mongodb

    echo "Now using mongo $VERSION"
}

### Git
###

get_git_tag() {
    case "$CI_NAME" in
        github)
            if [ $"GITHUB_REF_TYPE" = "tag" ]; then
               echo "$GITHUB_REF_NAME"
            fi
            ;;
        gitlab)
            echo "${CI_COMMIT_TAG:-}"
            ;;
        travis)
            echo "${TRAVIS_TAG:-}"
            ;;
        *)
            git tag --points-at
            ;;
    esac
}

get_git_branch() {
    case "$CI_NAME" in
        github)
            if [ $"GITHUB_REF_TYPE" = "branch" ]; then
               echo "$GITHUB_REF_NAME"
            fi
            ;;
        gitlab)
            if [ -z "$CI_COMMIT_TAG" ]; then
                echo "$CI_COMMIT_REF_NAME"
            fi
            ;;
        travis)
            if [ -z "$TRAVIS_TAG" ]; then
                echo "$TRAVIS_BRANCH"
            fi
            ;;
        *)
            git branch --show-current
            ;;
    esac
}

get_git_commit_sha() {
    case "$CI_NAME" in
        github)
            echo "$GITHUB_SHA"
            ;;
        gitlab)
            echo "$CI_COMMIT_SHA"
            ;;
        travis)
            echo "$TRAVIS_COMMIT"
            ;;
        *)
            git rev-parse HEAD
            ;;
    esac
}

get_git_changed_files() {
    local COMMIT0=${1:-HEAD}
    local COMMIT1=${2:-"$COMMIT0"^}

    if [ -z "$CI_NAME" ]; then
        git diff --name-only "$COMMIT0" "$COMMIT1"
    fi
}

### Github
###

deploy_gh_pages() {
    local REPO_PATH=$1
    local DOCS_PATH=$2
    local BRANCH="${3:-gh-pages}"
    local WORK_PATH
    WORK_PATH="$(mktemp -d -p "$TMP_PATH" gh_pages.XXXXXX)"

    # Create a worktree with $BRANCH checked out in it
    cd "$REPO_PATH" && git worktree add "$WORK_PATH" "$BRANCH"
    # Copy new doc build in there
    cp -fR "$DOCS_PATH"/* "$WORK_PATH"
    # Get current commit to include in doc commit message
    local LOCAL_COMMIT
    LOCAL_COMMIT=$(get_git_commit_sha)
    # Add new doc and commit (add a .nojekyll file to skip Github jekyll processing)
    cd "$WORK_PATH" && touch .nojekyll && git add --all && git commit -m "Doc build from $LOCAL_COMMIT"
    # Push
    git push origin "$BRANCH"
    # Remove temp worktree
    git worktree remove "$WORK_PATH"
}

### Log
###

begin_group() {
    local TITLE="$1"

    if [ "$CI_ID" = "github" ]; then
        # see https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#grouping-log-lines
        echo "::group::$TITLE"
    elif [ "$CI_ID" = "gitlab" ]; then
        # see https://docs.gitlab.com/ee/ci/jobs/#custom-collapsible-sections
        echo -e "\e[0Ksection_start:$(date +%s):$TITLE\r\e[0KHeader of the 1st collapsible section"
    elif [ "$CI_ID" = "travis" ]; then
        # see
        echo "travis_fold:start:$TITLE"
    fi
}

end_group() {
    local TITLE="$1"

    if [ "$CI_ID" = "github" ]; then
        echo "::endgroup::"
    elif [ "$CI_ID" = "gitlab" ]; then
        echo -e "\e[0Ksection_end:$(date +%s):$TITLE\r\e[0K"
    elif [ "$CI_ID" = "travis" ]; then
        echo "travis_fold:end:$TITLE"
    fi
}

