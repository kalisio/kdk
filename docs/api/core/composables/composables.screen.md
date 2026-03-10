# Screen

## Overview

`useScreen(options)` wraps the [Quasar Screen plugin](https://quasar.dev/options/screen-plugin/) with additional reactive helpers for responsive design, orientation detection, and fullscreen management.

## Usage

```javascript
import { useScreen } from '@kalisio/kdk/core.client'

const { Screen, dense, wide, orientation, Fullscreen, toggleFullscreen } = useScreen()
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `options.dense` | `string` | `'sm'` | Quasar breakpoint name. `dense` is `true` when the screen is smaller than this breakpoint. |
| `options.wide` | `string` | `'sm'` | Quasar breakpoint name. `wide` is `true` when the screen is larger than this breakpoint. |

## Exposed

| Name | Type | Description |
|------|------|-------------|
| `Screen` | `readonly Object` | The Quasar screen object (width, height, breakpoints, etc.). See the [Quasar docs](https://quasar.dev/options/screen-plugin/) for the full shape. |
| `dense` | `ComputedRef<boolean>` | `true` when the screen width is below the `dense` breakpoint. |
| `wide` | `ComputedRef<boolean>` | `true` when the screen width is above the `wide` breakpoint. |
| `orientation` | `ComputedRef<'landscape' \| 'portrait'>` | Current screen orientation derived from width vs height. |
| `Fullscreen` | `readonly Ref<boolean>` | `true` when the browser is in fullscreen mode. |
| `toggleFullscreen()` | `Function` | Toggles fullscreen mode. Returns a promise. |
| `lockOrientation(orientation)` | `Function` | Locks the screen orientation if the browser supports it. |
