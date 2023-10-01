# Develop with KDK

KDK and third-party Kalisio modules are [Feathers modules](https://docs.feathersjs.com), so you will find most of the required information in the linked Feathers documentation. Typically for development you will do the following so that a module is ready-to-use:
```bash
cd kdk
yarn install
yarn link
```

## Linting the code

The **KDK** relies on [JavaScript standard style](https://github.com/feross/standard).

To lint the code:

```bash
$yarn lint
```

You can also lint each of the submodules independently using the following commands:

```bash
$yarn lint:core   # lint the core part
$yarn lint:map    # lint the map part
```
:::

## Web app

Please follow our [application template development guide](https://kalisio.github.io/skeleton/guides/development/develop.html).
