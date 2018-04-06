## Publish

### Prerequisites

#### Install Change log generator

This [gem](https://github.com/skywinder/github-changelog-generator) generates a change log file based on **tags**, **issues** and merged **pull requests** (and splits them into separate lists according to labels) from :octocat: GitHub Issue Tracker. This requires you to install (e.g. for Windows) [Ruby](http://rubyinstaller.org/downloads/) and its [DevKit](https://github.com/oneclick/rubyinstaller/wiki/Development-Kit).

### Web app

The same process applies when releasing a patch, minor or major version, i.e. the following tasks are done:
* increase the package version number in the **package.json** file (frontend and backend API)
* create a tag accordingly in the git repository and push it
* generates the changelog in the git repository and push it

> **Before you publish your app take care of updating the version of all dependent plugins to the latest version published, for example  perform `yarn upgrade kCore kTeam kClient`**

Depending on the release type the following command will do the job (where type is either `patch`, `minor`, `major`):
```bash
yarn/npm run release:type
```

Because Kalisio web app are also released as Docker images you can build it like this:
```bash
docker build -t kalisio/kapp .
```
Then release it as latest version:
```bash
docker login
docker push kalisio/kapp
```
And tag it (`version_tag` being the current version number like `1.1.2`)
```bash
docker tag kalisio/kapp kalisio/kapp:version_tag
docker push kalisio/kapp:version_tag
```

> This requires you to have a DockerHub account and be a team member of the Kalisio organization, if you'd like to become a maintainer please tell us

### Plugins

The same process applies as for the web app but in addition the module is published on the NPM registry.

> This requires you to have a NPM and GitHub account and be a team member of the Kalisio organization, if you'd like to become a maintainer please tell us

> **Before you publish a plugin take care of updating the version of your dependent plugins to the latest version published, for example  perform `yarn upgrade kCore` for a plugin depending on the core plugin before publishing it**

## Security

As an application often relies on third-party services its configuration must include secrets like API keys, passwords, etc. In this section we detail how we manage it in a secure way.

**The most important point is you should never store passwords or other sensitive data in source code, and you shouldn't use production secrets in development and test mode.**

### Using environment variables

Environment variables might be used to store secrets then retrieved in config files like this:
```
github: {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET
}
```

In your local development environment you should use a script to setup all the required secrets. This script should be safe-guarded in a non-public environment.

When using Travis CI you can use [encrypted variables](https://docs.travis-ci.com/user/environment-variables/) set either in build file or repository settings.

**If you'd like to set a value holding multilines or special characters take care to surround it with `"` so that it will be properly escaped.**
