# Command-line tools

## KDK CLI

The KDK CLI is a multiplexer for usual git/npm/yarn commands used when developing KDK-based applications. It allows to easily clone, install, link, unlink, switch branch on all modules and application using a single command.

### Installation

Production version:
```bash
npm install -g @kalisio/kdk
```

Or to use the master branch:
```bash
git clone https://github.com/kalisio/kdk.git
cd kdk
npm install
npm link
```

### Usage

The CLI relies on a workspace file defining the dependency tree between your KDK-based application and modules like this:
```
module.exports = {
  // Each key is the repo name of a module or application
  kCore: {
    dependencies: [] // List of dependent kalisio modules if any
  },
  kApp: {
    application: true, // Indicates if this is the main application module
    dependencies: ['@kalisio/kdk-core']
  }
}

```
All operations will take effect in the current working directory so that subdirectories named according to modules will be created or expected to already exist.

```
// Will clone all repositories
kalisio workspace.js --clone
// Will install dependencies in all modules and application
kalisio workspace.js --install
// Will perform link between required modules and application
kalisio workspace.js --link
// Will perform unlink between required modules and application
kalisio workspace.js --unlink
// Will perform branch switching on all modules and application
kalisio workspace.js --branch test
```

::: tip
This CLI assumes git and yarn are already globally installed on your system.
:::

Sample [workspaces](https://github.com/kalisio/kdk/tree/master/workspaces) for our [application template](https://github.com/kalisio/kApp), [Kano](https://github.com/kalisio/kano) and [Akt'n'Map](https://github.com/kalisio/aktnmap) are provided.

## [Screen](https://doc.ubuntu-fr.org/screen)

We use it to launch processes in the background on servers, which won't be killed when closing the ssh session.

## [Tail](https://www.linode.com/docs/tools-reference/tools/view-and-follow-the-end-of-text-files-with-tail)

To track logs currently written, Docker has an [equivalent command](https://docs.docker.com/engine/reference/commandline/logs/).

## [ConEmu](https://github.com/Maximus5/ConEmu)

Customizable Windows terminal.

To add new tasks *right click on settings > Startup/Tasks*, and add commands like this to open a new PowerShell at a given location:
`powershell.exe -new_console:t:"TaskName":d:D:\path-to-directory`.

If you'd like the PowerShell to execute a script at launch time (e.g. to setup your environment variables): `powershell.exe -noexit path-to-script new_console:t:"TaskName":d:D:\path-to-directory`

To make a command executed by default *right click on settings > Startup > Select it as named task*.

> It might be required to modify the [execution policy](https://technet.microsoft.com/fr-FR/library/hh847748.aspx), e.g. `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned`.

## [Travis CLI](https://github.com/travis-ci/travis.rb#installation)

To encrypt a file in reliable manner use a Linux VM or container because this does not work under Windows. For example with https://hub.docker.com/r/caktux/travis-cli/:
```
docker pull caktux/travis-cli
// Mount your project as volume
// Override the default entry point which automatically launch the travis CLI with provided arguments
// otherwise you cannot do multiple commands
docker run -it --name travis -v d:/Development/kalisio/kaabah:/project --entrypoint="" --rm caktux/travis-cli sh
$ travis login
$ travis encrypt-file ssh.pem
```

Add the output to your build script:
```
before_install:
  - openssl aes-256-cbc -K $encrypted_12c8071d2874_key -iv $encrypted_12c8071d2874_iv -in ssh.pem.enc -out ssh.pem -d
```

## MongoDB

Export a given collection from a given DB using a query in a JSON file: `mongoexport -d krawler-test -c world_cities_csv -q "{ 'properties.country': 'France' }" --jsonArray --out file.json`

Export a given collection from a given DB using a query in a CSV file: `mongoexport -d krawler-test -c world_cities_csv -q "{ 'properties.country': 'France' }" --type csv --fields properties.country,properties.pop --out file.csv`

