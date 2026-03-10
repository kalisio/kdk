# Logger hooks

## Overview

Hooks for logging service method execution and errors.

## Functions

### `log(hook)`

> Usually used as an app-level hook.

Logs information about each hook execution:

- **Error hooks**: logs the error message and stack trace at `error` level.
- **All hooks (normal)**: logs `"{type}: {path} - Method: {method}"` at `debug` level.
- **Development mode only**: logs full `hook.data`, `hook.params`, and `hook.result` at `silly` level.

::: tip
The detailed `silly`-level logging is only active in `NODE_ENV=development` to avoid the CPU overhead of serializing large hook objects in production.
:::
