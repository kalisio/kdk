# Files

## Overview

The `utils.files.js` module provides browser-compatible file path and size utilities, built on top of [`path-browserify`](https://github.com/browserify/path-browserify).

## Functions

### `getFileName(filePath)`

Returns the full file name including extension.

- **Parameters:**
  - `filePath` *(string)*: The file path.
- **Returns:** `string` — e.g. `'document.pdf'` from `'/docs/document.pdf'`.

### `getExtension(filePath)`

Returns the file extension including the leading dot.

- **Parameters:**
  - `filePath` *(string)*: The file path.
- **Returns:** `string` — e.g. `'.pdf'`.

### `getBaseName(filePath)`

Returns the file name without the extension.

- **Parameters:**
  - `filePath` *(string)*: The file path.
- **Returns:** `string` — e.g. `'document'` from `'document.pdf'`.

### `getDir(filePath)`

Returns the directory portion of the path.

- **Parameters:**
  - `filePath` *(string)*: The file path.
- **Returns:** `string` — e.g. `'/docs'` from `'/docs/document.pdf'`.

### `formatSize(bytes)`

Formats a byte count as a human-readable string with an appropriate unit.

- **Parameters:**
  - `bytes` *(number)*: The file size in bytes.
- **Returns:** `string` — the formatted size, e.g. `'1.50 MB'` or `'512 B'`. Integer values are shown without decimals. Units are localised via the KDK i18n system.
