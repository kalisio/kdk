# Deploy your app

## Deployment pipeline

The main purpose of the continuous integration and deployment (CI/CD) pipeline is to create/build application artifacts (Docker images for the web application + mobile application bundles) and deploy it in production-like environments in order to test it. The global CI/CD pipeline is illustrated in the following schema:

![Deployment pipeline](./../../assets/cd-pipeline.svg)

The different operations performed by each stages are the following:
* **BUILD**: executes the *travis.build.sh* script to create the Docker images
* **TEST**: executes the *travis.test.sh* script to run backend and frontend tests
* **DEPLOY**: executes the *travis.deploy.sh* script to deploy the web application on the target infrastruture
* **ANDROID**: executes the *travis.android.sh* script to build the Android APK
* **IOS**: executes the *travis.ios.sh* script to build the iOS IPA

::: tip
You can skip any of this stage by adding `[skip stage]` to your commit message, e.g. `[skip android]` to skip the Android build
:::

CI/CD comes al well in three different flavors, as defined by the value of the `FLAVOR`/`NODE_APP_INSTANCE` environment variables:
* **dev**: in order to deploy current development/alpha version, linked to the `master` branch of your code
* **test**: in order to deploy current staging/beta version, linked to the `test` branch of your code
* **prod**: in order to deploy current production version, linked to `tags` on the `test` branch of your code

::: tip
In the CI/CD process the `FLAVOR`/`NODE_APP_INSTANCE` environment variable is automatically set based on the branch/tag you are pushing
:::

Starting from the following base application setup:
* a root domain, defined by the value of the `DOMAIN` environment variable like `kalisio.xyz`
* a version number, defined by the value of the `VERSION` environment variable like `1.3.0` and automatically extracted from your *package.json* file
* a name, defined in the `APP` environment variable like `kapp`

Each flavor is then attached to a different target infrastructure, subdomain and version tag:
* **dev**: `SUBDOMAIN=dev.$DOMAIN`, `VERSION_TAG=$VERSION-dev`
* **test**: `SUBDOMAIN=test.$DOMAIN`, `VERSION_TAG=$VERSION-test`
* **prod**: `SUBDOMAIN=$DOMAIN`, `VERSION_TAG=$VERSION`

The subdomain is usually used to build a fully-qualified domain name for the application based on its name, i.e. `$APP.$SUBDOMAIN`. The version tag defines the name of the created Docker images like `$APP:$VERSION_TAG`, based on the associated Docker file `dockerfile.$FLAVOR`.

**To be completed**

## Configure CI/CD

We heavily rely on [Travis CI](https://travis-ci.org) for continuous integration and delivery, as such you need to create the CI/CD pipeline in Travis CI by syncing your GitHub repository.

As an application often relies on third-party services its configuration must include secrets like API keys, passwords, etc. In this section we detail how we manage it in a secure way. Indeed, to set up the CI/CD pipeline, sensitive data are needed to access the required services (SSH, third-party, etc.) and **should not be pushed under source control unless you use private repositories or encryption**.

### Secret variables

If some of the sensitive data are stored using environment variables, you have to use [encrypted environment variables](https://docs.travis-ci.com/user/environment-variables/) set either in build file or repository settings.

::: warning
If you'd like to set a value holding multilines or special characters take care to surround it with `"` so that it will be properly escaped.
:::

### Secret file

If you need additional sensitive data stored through [files](https://docs.travis-ci.com/user/encrypting-files/) create a *secrets.tar* containing all secured files and encode it to *secrets.tar.enc* a using [Travis CLI](../../tools/cli.md#travis-cli). This file will be decrypted before the build or whenever you need something inside.

Indeed, as mentioned in the [documentation](https://docs.travis-ci.com/user/encrypting-files/#Encrypting-multiple-files), it is not possible to encrypt multiple files and thus requires to create a `tar` file containing the different secret files and encrypts the archive. 

The table below lists for example the required files to publish a mobile app using Cordova:

| File | Description |
|:-----|:------------|
| keystore file| A binary file containing the private key of the certificate you need to sign the Android app |
| cordova build file | A Json file used by Cordova to sign the generated application. It uses the keystore file |
| google play service account | A Json file storing the data needed to use the Google Play service account |
| google services account | A Json file storing the the keys to access the various Google services |

You need to be logged into Travis CI before generating the secret file like this:
```
tar cvf secrets.tar your_keystore.keystore build.json google-play.json google-services.json
travis encrypt-file secrets.tar
```

## Configure application

Depending on the third-party services you need you will have to do the following:
* Generate a secret to secure your authentication, use one generated by the Feathers CLI
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

::: tip
Note: some of the previous accounts/IDs are not app specific and can be share accross multiple apps, e.g. S3, SNS, etc.
:::

Create required environment variables in a script file you can source before launching your app:
```
export APP_SECRET=xxx
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

Then, retrieve this variables in config files like this:
```
github: {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET
}
```

In your local development environment you should use the script to setup all the required secrets. This script should be safe-guarded in a non-public environment.

::: danger
You should never store production passwords or other sensitive production data in a clear form in source code or config files.
:::

During the CI/CD process the script *travis.env.sh* automatically generates a temporary environment file, based on the secret environment variables defined in your Travis repository settings, to be sourced at the different stages.

::: warning
You shouldn't use production secrets in development and test mode.
:::