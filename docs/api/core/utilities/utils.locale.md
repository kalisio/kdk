# Locale

## Overview

The `utils.locale.js` module provide functions to retrieve locale application settings.

## Functions

### `getBrowserLocale()`

Returns the user's browser locale using several possible sources.

- **Returns:**  
  - *(string)* — A locale string in the `language-region` format (e.g., `en-US`, `fr-FR`).

### `getLocale(languageOnly = true)`

Retrieves the application's default locale from configuration, falling back to the browser locale if not specified.

- **Parameters:**
  - `languageOnly` *(`boolean`, default: `true`)*: If `true`, returns only the language part of the locale (e.g., `en` from `en-GB`).

- **Returns:**  
  - *(string)* — The configured or detected locale string, either full (`en-GB`) or just the language (`en`).

### `getFallbackLocale(languageOnly = true)`

Retrieves the fallback locale defined in the configuration, with an option to extract just the language portion.

- **Parameters:**
  - `languageOnly` *(`boolean`, default: `true`)*: If `true`, returns only the language part of the fallback locale.

- **Returns:**  
  - *(string)* — The fallback locale, either full (`en-GB`) or just the language (`en`).

