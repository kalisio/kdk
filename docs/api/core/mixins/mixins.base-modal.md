# Base Modal

## Overview

The `baseModal` mixin provides the fundamental open/close state management for modal dialogs. It supports two modes of operation:

- **Router mode** (default): the modal is automatically opened when the component is created, and closing it navigates back to the previous route.
- **Standalone mode** (`routerMode: false`): open/close state is managed programmatically without any router interaction.

## Usage

```javascript
import { baseModal } from '@kalisio/kdk/core/client'

export default {
  mixins: [baseModal],
  // ...
}
```

## Emits

| Event | Payload | Description |
|-------|---------|-------------|
| `opened` | — | Emitted when the modal is opened. |
| `closed` | — | Emitted when the modal is closed. |

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `routerMode` | `Boolean` | `true` | When `true`, opening the modal is triggered automatically on component creation and closing navigates back to the previous route. |

## Data

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `isModalOpened` | `Boolean` | `false` | Whether the modal is currently open. |
| `isModalMaximized` | `Boolean` | `false` | Whether the modal is currently maximized. |

## Methods

### `openModal(maximized)`

Opens the modal and optionally maximizes it.

- **Parameters:**
  - `maximized` *(boolean, default `false`)*: When `true`, sets `isModalMaximized` to `true`.
- **Emits:** `opened`

```javascript
this.openModal()          // open in normal size
this.openModal(true)      // open maximized
```

### `closeModal()`

Closes the modal. In router mode, navigates back to the route that was active before the modal was opened.

- **Emits:** `closed`

## Lifecycle

- **`created`**: if `routerMode` is `true`, stores the current history back state as `this.previousRoute` and calls `openModal()` immediately.

::: tip
In router mode, modals are typically rendered as route components so that navigating to their URL automatically displays them and navigating away closes them.
:::
