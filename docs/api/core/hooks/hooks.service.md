# Service hooks

## Overview

Hooks for controlling service-level behaviour: suppressing real-time events, rate limiting, and resource quota enforcement.

## Functions

### `skipEvents(hook)`

Suppresses the real-time event normally emitted by a service method by setting `hook.event = null`. Useful when a service operation should not trigger client-side reactivity.

---

### `rateLimit(options)`

> To be used as a `before` hook. Returns a hook function.

Rate-limits calls to a service (and optionally a specific operation) using the [token bucket algorithm](https://en.wikipedia.org/wiki/Token_bucket). Throws `TooManyRequests` when the token bucket is exhausted.

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `tokensPerInterval` | number | Number of allowed requests per interval |
| `interval` | number \| string | Interval duration (ms or a string like `'second'`) |
| `operation` | string *(optional)* | Restrict rate limiting to a specific method (e.g. `'create'`) |
| `service` | string *(optional)* | Restrict rate limiting to a specific service name (useful as an app-level hook) |

---

### `countLimit(options)`

> To be used as a `before` hook. Returns a hook function.

Enforces a maximum number of existing resources before allowing a new one to be created. Throws `Forbidden` when the quota is exceeded. A value of `-1` for `max` disables the limit.

#### Options

| Option | Type | Description |
|--------|------|-------------|
| `max` | number \| Function | Maximum allowed count, or an async function `(hook) => number` |
| `service` | string \| Function | Target service name or async function `(hook) => service` used to count existing items |
| `query` | Object \| Function | Query applied when counting, or a function `(hook) => query` |
| `count` | Function *(optional)* | Custom async count function `(hook) => number` replacing the built-in service find |
