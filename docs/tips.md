# Tips

## Linking errors

Due to the modular approach of the KDK we need to [link](https://medium.com/@alexishevia/the-magic-behind-npm-link-d94dcb3a81af) the modules and the applications according to the dependency tree when developing.

::: tip
Due to some [changes](http://codetunnel.io/npm-5-changes-to-npm-link/) in the way `npm` manages linked modules we prefer to use [Yarn](https://yarnpkg.com) as a package manager.
:::

It appeared that when performing a new install, adding a new dependency, or launching two installs concurrently, some of these links often break raising different errors, probably due to the fact incompatible versions of the same library (e.g. Feathers) are installed:
* `TypeError: processNextTick is not a function`
* `TypeError: Cannot read property 'eventMappings' of undefined`
* `An unexpected error occurred: "ENOENT: no such file or directory, scandir 'xxx'`
* ...

As a workaround you will either need to:
* clear the yarn cache `yarn cache clean` (or `yarn cache clean module` to be more specific)
* restore the broken links using commands like e.g. `yarn link @kalisio/kdk-core` in the broken modules/applications
* reinstall all dependencies using `yarn install` in broken modules/applications, and then restore the links as above

::: tip
You might also clean all dependencies frist using [`rimraf node_modules`](http://www.nikola-breznjak.com/blog/javascript/nodejs/how-to-delete-node_modules-folder-on-windows-machine/) 
:::