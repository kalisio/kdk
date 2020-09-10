# Command-line tools

## KDK CLI

The KDK CLI (a.k.a. `kli`) is a multiplexer for usual git/npm/yarn commands used when developing KDK-based applications. It allows to easily clone, install, link, unlink, switch branch on all modules and application using a single command.

### Installation

Production version:
```bash
npm install -g @kalisio/kli
```

Or to use the master branch locally:
```bash
git clone https://github.com/kalisio/kli.git
cd kli
npm install
npm link
```

### Usage

The CLI relies on a workspace file defining the dependency tree between your KDK-based application and modules like this:
```
module.exports = {
  // Each key is the repo name of a module or application
  kdk: {
    dependencies: [], // List of dependent KDK modules if any
    branches: ['master', 'test'] // List of branches the module is available on
    // If the current target branch of the CLI is not included it will be skipped
  },
  kApp: {
    application: true, // Indicates if this is the main application module
    dependencies: ['@kalisio/kdk/core'],
    branch: 'master' // Branch the module should be forced on whatever the current target branch of the CLI
  }
}

```

::: tip
The `branch` option can also target a git tag, typically fo production releases.
:::

All operations will take effect in the current working directory so that subdirectories named according to modules will be created or expected to already exist.

```
// Will clone all repositories
kdk workspace.js --clone
// Will install dependencies in all modules and application
kdk workspace.js --install
// Will perform link between required modules and application
kdk workspace.js --link
// Will perform unlink between required modules and application
kdk workspace.js --unlink
// Will perform branch switching on all modules and application
kdk workspace.js --branch test
```

::: tip
This CLI assumes git and yarn are already globally installed on your system.
:::

::: warning
By default all Git operations target the `kalisio` organization, you can change this for the whole workspace using the `organization` CLI option or on specific modules only using the `organization` option in the workspace file. Like this you include modules coming from a separate organization but used as dependencies of the project owned by the main organization of the project.
:::

::: warning
All operations are performed relative to the CWD by default, you can change this for specific modules only using the `path` option in the workspace file providing a module path relative to the CWD. Like this you can for instance have modules coming from a separate organization isolated into their own directory.
:::

Sample workspaces for our [application template](https://github.com/kalisio/kApp) and [Kano](https://github.com/kalisio/kano) are provided in the [kli repository](https://github.com/kalisio/kli).

Full CLI usage is the following:
```
Usage: index <workspacefile> [options]

Options:
  -V, --version                      output the version number
  -o, --organization [organization]  GitHub organization owing the project (default: "kalisio")
  -d, --debug                        Verbose output for debugging
  -c, --clone [branch]               Clone git repositories (with optional target branch)
  -p, --pull                         Pull git repositories
  -i, --install                      Perform yarn install
  -l, --link                         Perform yarn link
  -ul, --unlink                      Perform yarn unlink
  -b, --branch <branch>              Switch git branch
  -m, --modules <modules>            Comma separated list of modules from the workspace to apply command on
  -h, --help                         output usage information
```

## [Gitrob](https://github.com/michenriksen/gitrob)

Gitrob is a tool to help find potentially sensitive files pushed to public repositories on Github. Simply run it using a GitHub token and a target user or organisation: `gitrob -github-access-token XXX kalisio`.

Then you can open the WebUI at [http://localhost:9393](http://localhost:9393) and see what's going on.

## [Nohup](https://en.wikipedia.org/wiki/Nohup)

We use it to launch processes in the background on servers, which won't be killed when closing the ssh session.

[Screen](https://doc.ubuntu-fr.org/screen) can also do the job

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
