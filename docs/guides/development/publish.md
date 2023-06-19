# Publish with KDK

The same process applies when releasing a patch, minor or major version of the KDK and third-party Kalisio modules, i.e. the following tasks are done automatically on release:
1. increase the package version number in the **package.json** file (frontend and backend API)
2. publish the module on the NPM registry
3. create a tag accordingly in the git repository and push it

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
Before you publish a module take care of updating the version of your dependent modules to the latest version published, for example  perform `yarn upgrade xxx` for a module depending on the xxx module before publishing it
:::

## Web app

Almost the same process applies as for the modules except the app is not published on the NPM registry but in the Docker Hub. However, the process is less automated to ensure more flexibility so that the build artefacts of the different flavors can be managed independently. 

Please follow our [application template publishing guide](https://kalisio.github.io/kApp/guides/development/publish.html).
