# Capture utilities

## Overview

This module provides the `capture` function for generating map screenshots or PDF exports via the KDK capture service. It supports single or multi-time captures and assembles the results into image files or a multi-page PDF.

## Functions

### `capture(values)`

Sends a capture request to the KDK capture service for the current map activity and exports the result as image(s) or a PDF.

- **Parameters:**
  - `values` *(Object)*: Capture configuration object:
    - `dateTime.start` *(string)*: ISO 8601 start datetime for the capture range.
    - `dateTime.end` *(string)*: ISO 8601 end datetime for the capture range. When equal to `start`, a single capture is produced.
    - `resolution.width` *(string | number)*: Width of the output image in pixels.
    - `resolution.height` *(string | number)*: Height of the output image in pixels.
    - `format` *('pdf' | string)*: Output format. When `'pdf'`, all captures are assembled into a single PDF; otherwise each capture is exported as a separate PNG file.
    - `header` *(string, optional)*: Text content for the capture header overlay.
    - `footer` *(string, optional)*: Text content for the capture footer overlay.
    - `north` *(string, optional)*: Placement for the north arrow sticky (e.g. `'top-right'`). Must be one of: `right`, `left`, `top`, `bottom`, `top-left`, `top-right`, `bottom-right`, `bottom-left`.
    - `legend` *(string, optional)*: Placement for the legend window (same placement values as `north`).
    - `basePath` *(string, optional)*: Base URL path passed to the capture service. Defaults to `'/#/home/'`.
- **Returns:** `Promise<void>` — Triggers a file download for each captured image or the assembled PDF.

#### Behaviour

1. Reads the current activity's layer state and view bounding box.
2. Generates a date array between `start` and `end` using the current timeline step from the global store (`time.interval`).
3. Posts each capture request to the gateway's `/capture` endpoint with a `Bearer` JWT if configured.
4. Shows a Quasar notification spinner during the operation.
5. On success, exports the result(s) using Quasar's `exportFile`.
6. On network/service error, emits a global `error` event.

::: tip
File names are resolved using i18n keys `utils.capture.CAPTURE_PDF_FILE` and `utils.capture.CAPTURE_IMAGE_FILE`, which receive the capture time as a template variable.
:::
