# Tips

## Generating service account tokens

If you'd like a third-party application to rely on the API of your application without authenticating using a user/password you can generate an access token with a fixed expiration date to be used as an API key.

If your API needs a user ID to work as expected first register a user as usual. Then, using your application secret and a [JWT library](https://jwt.io/), issue a JWT with a payload matching the configuration options of your application regarding audience (i.e. domain), issuer and the user ID if any, e.g.:
```json
{
  "aud": "kano.kargo.kalisio.xyz",
  "iss": "kalisio",
  "exp": 1552402010,
  "userId": "5bc5b166beb4648d3cd79327"
}
```

## Linking errors

Due to the modular approach of the KDK we need to [link](https://medium.com/@alexishevia/the-magic-behind-npm-link-d94dcb3a81af) the modules and the applications according to the dependency tree when developing.

::: tip
Due to some [changes](http://codetunnel.io/npm-5-changes-to-npm-link/) in the way `npm` manages linked modules we prefer to use [Yarn](https://yarnpkg.com) as a package manager.
:::

It appeared that when performing a new install, adding a new dependency, or launching two installs concurrently, some of these links often break raising different errors:
* `TypeError: Cannot read property 'eventMappings' of undefined`
* `TypeError: processNextTick is not a function`
* `Error: Cannot find module 'safer-buffer'`
* `An unexpected error occurred: "ENOENT: no such file or directory, scandir 'xxx'`
* ...

As a workaround you will either need to:
* clear the yarn cache `yarn cache clean` (or `yarn cache clean module` to be more specific)
* restore the broken links using commands like e.g. `yarn link @kalisio/kdk` in the broken applications
* reinstall all dependencies using `yarn install` in broken modules/applications, and then restore the links as above

::: tip
You might also clean all dependencies frist using [`rimraf node_modules`](http://www.nikola-breznjak.com/blog/javascript/nodejs/how-to-delete-node_modules-folder-on-windows-machine/) 
:::

::: tip
Errors are often visible when launching the app server but might come from an underlying module. For instance the `TypeError: Cannot read property 'eventMappings' of undefined` error often appears in modules, probably due to the fact incompatible versions of the same library (e.g. Feathers) are installed. So try first to reinstall and relink the modules before your app, and if you'd like to see if a module is fine running its tests is usually a good indicator: `yarn mocha`.
:::

## Running multiple applications side-by-side in development mode

For instance, as Kano depends for some features on a running Weacast API you will need to run both on your local environment. If your application also uses replication you will need to launch two instances in parallel. The problem is that by default all our apps uses the `8081` port for server and `8080` port for client in development mode, generating a port conflict. Similarly the Node.js debugger uses by default the `9229` port.

You should run the first server by defining eg. `PORT=8082` (to avoid port conflict). If single-sign-on is expected to work, define also `APP_SECRET=same value as in second application configuration` as environment variables. Then execute the `yarn dev:replica` command (will setup the Node.js debugger to use the `9229` port to avoid port conflict). Last, you can launch the second server/client as usual.

::: tip
You usually don't need the client application but only the API on the replica but if required you can launch another client similarly e.g. by setting `CLIENT_PORT=8083`.
:::

::: tip
If you need more than two side-by-side applications then use set [NODE_OPTIONS](https://nodejs.org/api/cli.html#cli_node_options_options) environment variable before launching each one, e.g. `NODE_OPTIONS='--inspect-port=9230'`.
:::

