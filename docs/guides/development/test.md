# Testing with KDK

The **KDK** relies on the [Mocha](https://mochajs.org/) testing framework and the [Chai](https://www.chaijs.com/) assertion library. 

KDK and third-party Kalisio modules are [Feathers modules](https://docs.feathersjs.com/guides/basics/testing.html), so you will find most of the required information in the linked Feathers documentation.

To run the module tests including linting and coverage : `$ yarn test`

To speed-up things simply run the tests with: `$ yarn mocha`

You can run the tests of each submodule independently using the following commands for the KDK:

```bash
$yarn mocha:core   # test the core module
$yarn mocha:map    # test the map module
```

:::tip
If you need to perform some specific tests, you can use the `-g` or `--grep` option of the `mocha` command:

```bash
$yarn mocha:core -g "core:team" # run the team tests
```
:::

## Web app

Please follow our [application template testing guide](https://kalisio.github.io/skeleton/guides/development/test.html).
