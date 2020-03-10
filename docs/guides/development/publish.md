# Publish your app

## Prerequisites

### Install Change log generator

In order to be able to generate the changelog for your published app/modules you need this [gem](https://github.com/skywinder/github-changelog-generator), which creates a log file based on **tags**, **issues** and merged **pull requests** (and splits them into separate lists according to labels) from :octocat: GitHub Issue Tracker. This requires you to install (e.g. for Windows) [Ruby](http://rubyinstaller.org/downloads/) and its [DevKit](https://github.com/oneclick/rubyinstaller/wiki/Development-Kit).

## Plugins/Modules

The same process applies when releasing a patch, minor or major version, i.e. the following tasks are done:
* increase the package version number in the **package.json** file (frontend and backend API)
* publish the module on the NPM registry
* create a tag accordingly in the git repository and push it
* generates the changelog in the git repository and push it

::: tip
Modules are published under the `@kalisio` namespace with a `kdk` prefix in NPM, e.g. `kCore` NPM package is named `@kalisio/kdk/core`
:::

::: warning
This requires you to have a NPM and GitHub account and be a team member of the Kalisio organization, if you'd like to become a maintainer please tell us
:::

Depending on the release type the following command will do the job (where type is either `patch`, `minor`, `major`):
```bash
yarn/npm run release:type
```

::: warning
If you have a lot of issues/PRs to be integrated in change log please [generate a GitHub token](https://github.com/github-changelog-generator/github-changelog-generator#github-token) to avoid rate-limiting on their API and set the `CHANGELOG_GITHUB_TOKEN` environment variable to your token before publishing**
:::

::: danger
The changelog suffers from the following [issue](https://github.com/github-changelog-generator/github-changelog-generator/issues/497) so you might have to edit the generated changelog when pushing on different branches
:::

::: warning
Before you publish a plugin take care of updating the version of your dependent plugins to the latest version published, for example  perform `yarn upgrade kCore` for a plugin depending on the core plugin before publishing it**
:::

## Web app

Almost the same process applies as for the plugins/modules except the app is not published on the NPM registry, i.e. the following tasks are to be done:
* increase the package version number in the **package.json** file (frontend and backend API)
* create a tag accordingly in the git repository and push it
* generates the changelog in the git repository and push it

::: warning
Before you publish your app take care of updating the version of all dependent plugins to the latest version published, for example  perform `yarn upgrade kCore kTeam`
:::

Depending on the release type the following command will do the job (where type is either `patch`, `minor`, `major`):
```bash
yarn/npm run release:type
```

::: warning
Depending on the app the push of tags or changlog is more or less automated in order to have more control so that youd could have more scripts to run in order to complete the publication
:::

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

::: warning
This requires you to have a DockerHub account and be a team member of the Kalisio organization, if you'd like to become a maintainer please tell us
:::
