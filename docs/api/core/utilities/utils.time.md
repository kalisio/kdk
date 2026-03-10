# Time

## Overview

The `utils.time.js` module provides time-related utilities for timezone labelling and interval-based time rounding, built on top of [Moment.js](https://momentjs.com/).

## Functions

### `getTimezoneLabel(timezone)`

Returns a human-readable timezone label including the UTC offset.

- **Parameters:**
  - `timezone` *(string)*: A valid IANA timezone name (e.g. `'Europe/Paris'`).
- **Returns:** `string` — e.g. `'Europe/Paris (+02:00)'`.

### `roundHours(hours, interval)`

Rounds an hour value down to the nearest multiple of `interval`.

- **Parameters:**
  - `hours` *(number)*: The hour value to round (0–23).
  - `interval` *(number)*: The interval in hours (e.g. `6` for 6-hourly rounding).
- **Returns:** `number` — the rounded hour.

```javascript
roundHours(14, 6) // → 12
```

### `roundMinutes(minutes, interval)`

Rounds a minutes value down to the nearest multiple of `interval`.

- **Parameters:**
  - `minutes` *(number)*: The minutes value to round (0–59).
  - `interval` *(number)*: The interval in minutes (e.g. `10` for 10-minute rounding).
- **Returns:** `number` — the rounded minutes.

```javascript
roundMinutes(47, 10) // → 40
```

### `getNearestIntervalTime(datetime, interval)`

Returns a clone of `datetime` snapped to the nearest past interval boundary.

- **Parameters:**
  - `datetime` *(Moment)*: A Moment.js datetime object.
  - `interval` *(number)*: The interval in seconds. Intervals above 3600 snap to hour boundaries; intervals at or below 3600 snap to minute boundaries.
- **Returns:** `Moment` — a cloned Moment with seconds and milliseconds zeroed and hours/minutes rounded down to the interval.

```javascript
getNearestIntervalTime(moment('2024-03-15T14:37:22'), 3600) // → 2024-03-15T14:00:00
getNearestIntervalTime(moment('2024-03-15T14:37:22'), 600)  // → 2024-03-15T14:30:00
```
