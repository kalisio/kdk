# Schema

## Overview

`useSchema()` provides JSON Schema loading, optional property filtering, AJV compilation, and localised validation within a Vue component. It uses the KDK `Schema` registry to compile and cache validators.

## Usage

```javascript
import { useSchema } from '@kalisio/kdk/core.client'

const { schema, compile, validate } = useSchema()
await compile('users.create')
const { isValid, errors } = validate(formValues)
```

## Exposed

| Name | Type | Description |
|------|------|-------------|
| `schema` | `readonly Ref<Object \| null>` | The currently loaded (and optionally filtered) JSON Schema object. `null` before `compile` is called. |
| `compile(schemaNameOrObject, propertiesFilter?)` | `async Function` | Loads or clones the schema, applies optional property filtering, and compiles it with AJV via the `Schema` registry. `schemaNameOrObject` can be a schema resource name string (e.g. `'users.create'`) or a schema object. `propertiesFilter` is an optional comma-separated string or array of property names to keep. |
| `validate(values)` | `Function` | Runs the compiled validator against `values`. Applies ajv-i18n localisation to error messages. Returns `{ isValid: boolean, errors: Array \| null }`. Returns `undefined` if `compile` has not been called yet. |

::: tip
Schema resource names follow the pattern `<service>.<operation>[-perspective]`. The `.json` extension and the `@schemas/` path alias are added automatically.
:::
