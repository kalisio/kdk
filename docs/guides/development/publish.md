# Publish your app

## Prerequisites

### Install Change log generator

In order to be able to generate the changelog for your published app/modules you need this [gem](https://github.com/skywinder/github-changelog-generator), which creates a log file based on **tags**, **issues** and merged **pull requests** (and splits them into separate lists according to labels) from :octocat: GitHub Issue Tracker. This requires you to install (e.g. for Windows) [Ruby](http://rubyinstaller.org/downloads/) and its [DevKit](https://github.com/oneclick/rubyinstaller/wiki/Development-Kit).

## Plugins/Modules

The same process applies when releasing a patch, minor or major version, i.e. the following tasks are done automatically on release:
1. increase the package version number in the **package.json** file (frontend and backend API)
2. publish the module on the NPM registry
3. create a tag accordingly in the git repository and push it
4. generates the changelog in the git repository and push it

::: tip
Kalisio maintained modules are published under the `@kalisio` namespace in NPM, e.g. `kdk` NPM package is named `@kalisio/kdk`, but you are free to use another one for your own modules.
:::

::: warning
This requires you to have a NPM and GitHub account and be a team member of the namespace organization, if you'd like to become a maintainer of Kalisio maintained modules please tell us.
:::

Depending on the release type the following command will do the job (where type is either `patch`, `minor`, `major`):
```bash
npm run release:type
```

::: warning
If you have a lot of issues/PRs to be integrated in change log please [generate a GitHub token](https://github.com/github-changelog-generator/github-changelog-generator#github-token) to avoid rate-limiting on their API and set the `CHANGELOG_GITHUB_TOKEN` environment variable to your token before publishing
:::

::: danger
The changelog suffers from the following [issue](https://github.com/github-changelog-generator/github-changelog-generator/issues/497) so you might have to edit the generated changelog when pushing on different branches or systematically merge changes to `master` before generating the changelog so that all issues are closed in Github.
:::

::: warning
Before you publish a module take care of updating the version of your dependent modules to the latest version published, for example  perform `yarn upgrade xxx` for a module depending on the xxx module before publishing it
:::

## Web app

Almost the same process applies as for the plugins/modules except the app is not published on the NPM registry but in the Docker Hub. However, the process is less automated to ensure more flexibility so that the build artefacts of the different flavors can be managed independently. In a nutshell, the tasks are performed manually and independently using the required commands at the different stages of the application lifecycle.

In order to change the version number in a web app you have to increase the package version number in the **package.json** file (frontend and backend API), and possibly Cordova configuration file, of your branch so that the generated artefacts will not erase previously published ones. Depending on the release typing the following command will do the job (where type is either `patch`, `minor`, `major`):
```bash
npm run release:type
```

Usually, you start a new version by creating a `test` (a.k.a release or staging) branch from your `master` branch. You should then increase the version number (major or minor) of your `master` branch so that the generated artefacts of the new development version will not erase previously published ones, e.g. `npm run release:major`.

When you are satisfied enough with your version you typically release it starting from your `test` (a.k.a release or staging) branch:
1. create a tag accordingly in the git repository and push it,
2. generates the changelog in the git repository and push it

This process usually triggers your [CI/CD](./deploy.md) process to build the target artefacts.

::: warning
Before you publish your app take care of updating the version of all dependent modules to the latest version published, for example perform `yarn upgrade kdk` to use the latest versin of the KDK.
:::

::: warning
If you are using our [CLI](../../tools/cli.md#kdk-cli) take care of updating/creating the required workspace file before you publish your app.
:::

Then, you should then increase the version patch number of your `test` branch so that the generated artefacts of the new staging version will not erase previously published ones, e.g. `npm run release:patch`. Indeed, a staging branch should only include patch versions not major/minor versions.

### Manual build

Because Kalisio web app are also released as Docker images you can build it like this:
```bash
docker build -t kalisio/kapp .
```
Then release it as latest version:
```bash
docker login
docker push kalisio/kapp
```
And tag it (`version_tag` being the current version number like `1.1.2-prod` or `1.1.0-dev` depending on the [flavor](./deploy.md))
```bash
docker tag kalisio/kapp kalisio/kapp:version_tag
docker push kalisio/kapp:version_tag
```

::: warning
This requires you to have a DockerHub account and be a team member of the Kalisio organization, if you'd like to become a maintainer please tell us
:::
