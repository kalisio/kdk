# Messages service

::: tip
Available as a contextual service
:::

## Overview

Manages messages within a context. Supports fuzzy and diacritic-insensitive full-text search across `title`, `body`, and `author` fields. Timestamps are automatically set on creation and kept in sync on update.

## Data model

| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Message title |
| `body` | String | Message body text |
| `author` | String | Author identifier |
| `createdAt` | Date | Creation timestamp (set automatically) |
| `updatedAt` | Date | Last update timestamp (set automatically) |

MongoDB indexes:
- `createdAt` — for time-based sorting
- `title`, `body`, `author` — collation-aware text indexes (English and French)

## Hooks

The following [hooks](../hooks.md) are executed on the `messages` service:

```mermaid
graph TB
  before{none before all}
  after{none after all}
  before --> hook1("fuzzySearch(['title','body','author'])")
  hook1 --> hook2(diacriticSearch)
  hook2 --> hook3(marshallComparisonQuery)
  hook3 --> FIND[FIND]
  FIND --> after
  before --> GET[GET]
  GET --> after
  before --> hook4("setNow('createdAt','updatedAt')")
  hook4 -- Timestamps set --> CREATE[CREATE]
  CREATE --> after
  before --> hook5("discard('createdAt','updatedAt')")
  hook5 --> hook6("setNow('updatedAt')")
  hook6 -- updatedAt refreshed --> UPDATE[UPDATE]
  UPDATE --> after
  before --> hook7("discard('createdAt','updatedAt')")
  hook7 --> hook8("setNow('updatedAt')")
  hook8 -- updatedAt refreshed --> PATCH[PATCH]
  PATCH --> after
  before --> REMOVE[REMOVE]
  REMOVE --> after
  linkStyle default stroke-width:2px,fill:none,stroke:black
  classDef hookClass fill:#f96,stroke:#333,stroke-width:2px
  class hook1,hook2,hook3,hook4,hook5,hook6,hook7,hook8 hookClass
  classDef operationClass fill:#9c6,stroke:#333,stroke-width:2px
  class FIND,GET,CREATE,UPDATE,PATCH,REMOVE operationClass
```
