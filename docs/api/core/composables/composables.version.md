# Version

## Overview

`useVersion()` exposes read-only access to the client and API version information. On first call it fetches the API version from the `Capabilities` singleton (which queries the server). Subsequent calls reuse the cached values.

## Usage

```javascript
import { useVersion } from '@kalisio/kdk/core.client'

const { clientVersionName, apiVersionName } = useVersion()
```

## Exposed

| Name | Type | Description |
|------|------|-------------|
| `Version` | `readonly Ref<Object>` | The full version object with the following shape: `{ client: { number, buildNumber }, api: { number, buildNumber }, flavor }`. Populated from application config and server capabilities. |
| `clientVersionName` | `ComputedRef<string>` | Human-readable client version string, e.g. `'1.2.3'` or `'1.2.3 (456)'` when a build number is present. |
| `apiVersionName` | `ComputedRef<string>` | Human-readable API version string with the same format as `clientVersionName`. |

::: tip
`useVersion()` is safe to call from multiple components — initialization only runs once.
:::
