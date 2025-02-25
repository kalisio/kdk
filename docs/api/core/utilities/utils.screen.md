# Screen

## Overview

The `utils.screen.js` module provides helper functions for handling responsive width, height, and fullscreen operations in a KDK-based application. 

It utilizes **Lodash**, **Vue's reactive references**, and **Quasar's Screen & Fullscreen APIs**.

## Functions

### `Fullscreen`

A reactive reference that tracks whether the application is in fullscreen mode.

- **Type:** `Ref<boolean>`
- **Source:** Derived from `AppFullscreen.isActive`

### `computeResponsiveWidth(width)`

Computes a responsive width based on the screen size or a percentage value.

- **Parameters:**
  - `width` *(number | object)*: Can be an absolute number, percentage, or an object with breakpoint-based values.
- **Returns:** Computed width in pixels or `undefined` if invalid.

### `computeResponsiveHeight(height)`

Computes a responsive height based on the screen size or a percentage value.

- **Parameters:**
  - `height` *(number | object)*: Can be an absolute number, percentage, or an object with breakpoint-based values.
- **Returns:** Computed height in pixels or `undefined` if invalid.

### `computeResponsiveSize(size)`

Computes a responsive size (width & height) based on screen dimensions.

- **Parameters:**
  - `size` *(array | object)*: Can be an array `[width, height]` or an object with breakpoint-based values.
- **Returns:** An array `[computedWidth, computedHeight]` or `undefined` if invalid.

### `getOrientation()`

Determines the current screen orientation.

- **Returns:** `'portrait'` if height is greater than width, otherwise `'landscape'`.

### `toggleFullscreen()`

Toggles the application's fullscreen mode.

- **Returns:** A promise that resolves `true` if successful, or rejects with `false` if an error occurs.

### `lockOrientation(orientation)`

Locks the screen orientation if the browser supports it.

- **Parameters:**
  - `orientation` *(string)*: The desired orientation (`'portrait'`, `'landscape'`, etc.).
- **Returns:** A promise that resolves when locking is successful.

## Usage

```javascript
import { computeResponsiveWidth, toggleFullscreen } from './utils.screen.js';

const width = computeResponsiveWidth(50); // Gets 50% of screen width
console.log(`Computed Width: ${width}px`);

try {
  await toggleFullscreen();
  console.log('Fullscreen mode toggled');
} catch (error) {
  console.error('Failed to toggle fullscreen mode', error);
}
```

