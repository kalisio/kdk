## DEPLOY

### Global pipeline

The global deployment pipeline is illustrated in the following schema:

![Deployment pipeline](./../figures/Deploy Pipeline Diagram.svg)

### Prerequisites

#### Configure third-party services

Depending on the services you need you will have to do the following:
* Create a Firebase app in the [Firebase Console](https://console.firebase.google.com)
  * retrieve the `google-services.json` to be stored as a secret file in the *cordova* directory
  * create an Android app in your Firebase app and keep track of secret server key in *Parameters > Cloud Messaging*
* Create a GCM application in the [AWS SNS console](https://eu-west-1.console.aws.amazon.com/sns/v2/home) using the previous server key
  * keep track of app ARN
* Create a new project for your app in the [Google Cloud Console](https://console.cloud.google.com)
  * Activate the Google+ API on your project
* Create an OAuth2 ID for a Web App in [Google Cloud Console](https://console.cloud.google.com) > *API & services*
  * the redirect URL should match *your.domain/auth/google/callback*
  * download the *json* dans keep track of client ID and secret 
* Create an OAuth2 App in [GitHub](https://github.com/organizations/kalisio/settings/applications)
  * the redirect URL should match *your.domain/auth/github/callback*
  * download the *json* dans keep track of client ID and secret
* Create an AWS user in [IAM](https://console.aws.amazon.com/iam/home) with access to S3 API (e.g. *AmazonS3FullAccess*)
  * keep track of access key ID and secret
* Create a bucket for your app in the Kalisio account
  * keep track of its name
* Create an AWS user in [IAM](https://console.aws.amazon.com/iam/home) with access to SNS API (e.g. *AmazonSNSFullAccess*)
  * keep track of access key ID and secret

Create required environment variables in a script file you can source before launching your app:
```
export GOOGLE_MAIL_USER=xxx
export GOOGLE_MAIL_PASSWORD=xxx
export SNS_ACCESS_KEY=xxx
export SNS_SECRET_ACCESS_KEY=xxx
export SNS_ANDROID_ARN=xxx
export S3_ACCESS_KEY=xxx
export S3_SECRET_ACCESS_KEY=xxx
export S3_BUCKET=xxx
export GITHUB_CLIENT_ID=xxx
export GITHUB_CLIENT_SECRET=xxx
export GOOGLE_CLIENT_ID=xxx
export GOOGLE_CLIENT_SECRET=xxx
```

> Note: some of the previous accounts/IDs are not app specific and can be share accross multiple apps, e.g. S3, SNS, etc.

Most information here should be [secured](./PUBLISH.MD#security) and **should not be pushed under source control unless you use private repositories (and even in this case it is best to secure it)**.

#### Configure continuous integration and delivery

We heavily rely on [Travis CI](https://travis-ci.org) for continuous integration and delivery, as such the best is to create a *secrets.tar* containing all secured files and encode it to *secrets.tar.enc* a using [Travis CLI](https://github.com/kalisio/kdk/blob/master/tools/CLI.MD#travis-cli). This file will be decrypted before the build or whenever you need something inside.



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





## Configuration

### Services

### Sensitive data

To set up the CI/CD pipeline, sensitive data are needed to access the different services and api. If some of these data can be stored using environment variables, others are stored through files and need to be pushed within the respoitory. For this purpose Travis CI offer a way to store these files within a unique encrypted archive.

See https://docs.travis-ci.com/user/encryption-keys/


## Secret archive

### Secret files

The table below lists all the required files:

| File | Description |
|:-----|:------------|
| keystore file| A binary file containing the private key of the certificate you need to sign the Android app |
| cordova build file | A Json file used by Cordova to sign the generated application. It uses the keystore file |
| google play service account | A Json file storing the data needed to use the Google Play service account |
| google services account | A Json file storing the the keys to access the various Google services |

### Creating the archive

As mentioned in the documentation (https://docs.travis-ci.com/user/encrypting-files/#Encrypting-multiple-files), is it not possible to encrypt multiple files. It is then required to create a `tar` file containing the different secret files and then to encrypt the archive.

You need to be logged in to Travis CI

```
tar cvf secrets.tar your_keystore.keystore build.json google-play.json google-services.json
travis encrypt-file secrets.tar
```




Do not push the secret files on your repository but keep them in a secure place !