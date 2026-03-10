# Import-Export service

::: tip
Available as a global service
:::

::: warning
`create` is the only method allowed from the client side.
:::

## Overview

This service relies on [feathers-import-export](https://github.com/kalisio/feathers-import-export). It provides bulk data import and export capabilities backed by an S3-compatible storage layer.

::: info
The `import-export` service instantiates its own internal **S3** service to avoid mixing temporary objects with the objects managed by the [Storage service](./storage.md).
:::

::: tip
For performance reasons, we do not recommend installing before/after hooks to transform data during import/export. Instead, use the [transformation functions](https://github.com/kalisio/feathers-import-export#transform-function) provided by the library.
:::

## Data model

No data model — data are stored directly on an S3-compatible storage backend.

## Hooks

The following [hooks](../hooks.md) are executed on the `import-export` service:

```mermaid
graph TB
  before{none before all}
  after{none after all}
  before --> hook1(disallow)
  hook1 --> FIND[FIND]
  FIND --> after
  before --> hook2(disallow)
  hook2 --> GET[GET]
  GET --> after
  before --> CREATE[CREATE]
  CREATE --> after
  before --> hook3(disallow)
  hook3 --> UPDATE[UPDATE]
  UPDATE --> after
  before --> hook4(disallow)
  hook4 --> PATCH[PATCH]
  PATCH --> after
  before --> hook5(disallow)
  hook5 --> REMOVE[REMOVE]
  REMOVE --> after
  linkStyle default stroke-width:2px,fill:none,stroke:black
  classDef hookClass fill:#f96,stroke:#333,stroke-width:2px
  class hook1,hook2,hook3,hook4,hook5 hookClass
  classDef operationClass fill:#9c6,stroke:#333,stroke-width:2px
  class FIND,GET,CREATE,UPDATE,PATCH,REMOVE operationClass
```
