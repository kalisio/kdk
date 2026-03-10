# Tags service

::: tip
Available as a contextual service
:::

## Overview

Manages tags that can be attached to resources within a context. Supports fuzzy and diacritic-insensitive search. Enforces uniqueness of tag names within the same service context. When a tag is updated or removed, the change is propagated to all resources that reference it via the `reflectTagUpdate` hook.

## Data model

A tag is a simple named object:

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Tag label (unique per service) |
| `value` | Any | Optional tag value |
| `scope` | String | Service scope/context |

MongoDB indexes:
- `name` — collation-aware text index (English and French)

## Hooks

The following [hooks](../hooks.md) are executed on the `tags` service:

```mermaid
graph TB
  before{none before all}
  after{none after all}
  before --> hook1("fuzzySearch(['name'])")
  hook1 --> hook2(diacriticSearch)
  hook2 --> FIND[FIND]
  FIND --> after
  before --> GET[GET]
  GET --> after
  before --> hook3("checkUnique('name')")
  hook3 -- Name uniqueness enforced --> CREATE[CREATE]
  CREATE --> after
  before --> hook4("checkUnique('name')")
  hook4 --> hook5(populatePreviousObject)
  hook5 -- Previous tag as params --> UPDATE[UPDATE]
  UPDATE --> hook6(reflectTagUpdate)
  hook6 -- Tag change propagated --> after
  before --> hook7("checkUnique('name')")
  hook7 --> hook8(populatePreviousObject)
  hook8 -- Previous tag as params --> PATCH[PATCH]
  PATCH --> hook9(reflectTagUpdate)
  hook9 -- Tag change propagated --> after
  before --> hook10(populatePreviousObject)
  hook10 -- Previous tag as params --> REMOVE[REMOVE]
  REMOVE --> hook11(reflectTagUpdate)
  hook11 -- Tag removed from resources --> after
  linkStyle default stroke-width:2px,fill:none,stroke:black
  classDef hookClass fill:#f96,stroke:#333,stroke-width:2px
  class hook1,hook2,hook3,hook4,hook5,hook6,hook7,hook8,hook9,hook10,hook11 hookClass
  classDef operationClass fill:#9c6,stroke:#333,stroke-width:2px
  class FIND,GET,CREATE,UPDATE,PATCH,REMOVE operationClass
```
