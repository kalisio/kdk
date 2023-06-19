# Setup your environment

## Prerequisites

### Install Node.js

[Node](https://nodejs.org/en/) is a server platform which runs JavaScript.
It's lightweight and efficient.
It has the largest ecosystem of open source libraries in the world.

- [Default install.](https://nodejs.org/en/)
- [Specific versions.](https://nodejs.org/en/download/)

::: warning
At the time of writing the KDK modules v2.x (`master` branch) are expected to work with Node.js 16.x and KDK modules v1.x are expected to work with Node.js 12.x
:::

::: tip
In order to be able to switch easily between different versions of Node.js we recommand to use a version manager like [n](https://github.com/tj/n)/[nvm](https://github.com/creationix/nvm) under Linux/Mac or [nvm](https://github.com/coreybutler/nvm-windows) under Windows.
:::

### Install Git

[git](https://git-scm.com/) is the version control system most frequently used in open source.
There are many resources available for installing it.

- [Linux.](https://www.atlassian.com/git/tutorials/install-git#linux)
- [macOS.](https://www.atlassian.com/git/tutorials/install-git#mac-os-x)
- [Windows.](https://www.atlassian.com/git/tutorials/install-git#windows)

::: tip
Under Windows we recommand using [Tortoise Git](https://tortoisegit.org/) and to set the [`autocrlf` flag](https://tortoisegit.org/docs/tortoisegit/tgit-dug-settings.html#tgit-dug-settings-git) in settings.
:::

### Install MongoDB

[Mongo](https://www.mongodb.com/) is an open-source, document database designed for ease of development and scaling.

- [Linux.](https://docs.mongodb.com/manual/administration/install-on-linux/)
- [macOS.](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
- [Windows.](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)

::: warning
At the time of writing the KDK modules v2.x (`master` branch) are expected to work with MongoDB 4.x and KDK modules v1.x are expected to work with MongoDB 3.x
:::

::: tip
We recommand using [Compass](https://www.mongodb.com/try/download/compass) as a GUI for MongoDB, [Robo 37](https://robomongo.org/) is also a good choice.
:::

### Install Yarn

Due to some [changes](http://codetunnel.io/npm-5-changes-to-npm-link/) in the way `npm` manages linked modules we prefer to use [Yarn](https://yarnpkg.com) as a package manager.

[Install Yarn](https://yarnpkg.com/en/docs/install) on your platform.

## Web app

Please follow our [application template installation from source code guide](https://kalisio.github.io/kApp/guides/installing-kapp.html#from-source-code).
