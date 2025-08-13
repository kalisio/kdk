# Colors

## Overview

The `utils.colors.js` module provides utilities for managing and manipulating colors.


It leverages external libraries such as `lodash`, `loglevel`, `quasar`, and `chroma-js` for efficient color handling.

## Constants

### `HtmlColors`

A collection of standard HTML color names mapped to their corresponding hex values.

### `Colors`

A predefined palette of commonly used colors, including primary and secondary shades.

## Functions

### **`getHtmlColor(color, defaultColor)`**

Retrieves the HTML color code for a given color name. If the color is not found, it falls back to a default color or tries to get it from Quasar's color palette.

- **Parameters:**
  - `color` *(string)*: The color name or hex code to retrieve.
  - `defaultColor` *(string)*: The fallback color if the input color is not found.

- **Returns:**
  - *(string)*: The corresponding hex code of the color.

### **`getPaletteFromColor(color, nearestIfNotFound = false)`**

Finds a matching color name from the predefined palette. If not found, it can return the closest available color (if `nearestIfNotFound` is `true`) or default to white.

- **Parameters:**
  - `color` *(string)*: The color name or hex code to look up.
  - `nearestIfNotFound` *(boolean, default: false)*: Whether to return the closest matching color if an exact match is not found.

- **Returns:**
  - *(string)*: The corresponding color name from the palette or the closest match.

### **`getContrastColor(color, light = 'white', dark = 'black')`**

Determines the best contrasting color (defaulting to white or black) based on the luminance of the given color. If the color is dark (low luminance), it returns the light color; if the color is light (high luminance), it returns the dark color.

- **Parameters:**
  - `color` *(string)*: The color name or hex code to analyze.
  - `light` *(string, default: 'white')*: The color to return if the input color is dark.
  - `dark` *(string, default: 'black')*: The color to return if the input color is light.

- **Returns:**
  - *(string)*: The most contrasting color (`light` or `dark`).

### **`findClosestColor(color)`** *(Private function)*

Finds the closest matching color in the predefined palette using `chroma-js`'s color difference (`deltaE`) algorithm.

- **Parameters:**
  - `color` *(string)*: The color name or hex code to match.

- **Returns:**
  - *(string | null)*: The closest matching color name from the palette, or `null` if no match is found.

### **`buildColorScale(options)`**

Creates a color scale using `chroma-js`, supporting:
- Predefined color sets
- Class-based distributions
- Optional domain scaling

If no colors are provided, it defaults to the `"Spectral"` color scheme.

- **Parameters:**
  - `options` *(object)*: Configuration options for the color scale.
    - `colors` *(string | array)*: The color scale to use.
    - `classes` *(array | number, optional)*: Class breaks for discrete scales.
    - `domain` *(array, optional)*: Domain values for the scale.

- **Returns:**
  - *(function)*: A `chroma-js` scale function based on the provided options.


