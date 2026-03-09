# Base Field

## Overview

The `baseField` mixin is the foundation for all form field components in KDK. It manages the field's internal model, error state, and a rich set of display-related computed properties derived from the field's JSON schema metadata. It is designed to be used alongside [Quasar field components](https://quasar.dev/vue-components/field).

The model is initialised from the `values` prop on creation and kept in sync via a watcher.

## Usage

```javascript
import { baseField } from '@kalisio/kdk/core/client'

export default {
  mixins: [baseField],
  // ...
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `values` | `Object` | no | `null` | An object holding the current field values, keyed by field name. The mixin reads `values[properties.name]` to initialise and update the model. |
| `properties` | `Object` | yes | — | The JSON schema property descriptor for this field. Expected to contain a `field` sub-object with display configuration and a `name` key. |
| `required` | `Boolean` | no | `false` | Whether this field is required. |
| `readOnly` | `Boolean` | no | `false` | Whether this field is read-only. |
| `dense` | `Boolean` | no | `false` | Whether to use a compact (dense) display mode. |

## Data

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `model` | `any` | `emptyModel()` | The reactive value bound to the field input. |
| `error` | `String` | `''` | The current validation error message. Empty when the field is valid. |

## Computed Properties

### `label`

Returns the field's display label. Sources in priority order:

1. `properties.field.label` (translated if a valid i18n key)
2. `properties.description` (JSON schema `description` metadata)

- **Returns:** `string`

### `hasHelper`

Returns whether a helper is configured for this field.

- **Returns:** `boolean`

### `helperLabel`

Returns the helper's label text, from `properties.field.helper.label`.

- **Returns:** `string | null`

### `helperIcon`

Returns the helper's icon, from `properties.field.helper.icon`.

- **Returns:** `string | undefined`

### `helperTooltip`

Returns the helper's tooltip text, from `properties.field.helper.tooltip`.

- **Returns:** `string`

### `helperUrl`

Returns the helper's URL, from `properties.field.helper.url`.

- **Returns:** `string | null`

### `helperDialog`

Returns the helper's dialog configuration, from `properties.field.helper.dialog`.

- **Returns:** `Object | null`

### `helperContext`

Returns the helper's context object, from `properties.field.helper.context`.

- **Returns:** `Object | null`

### `hasFocus`

Returns whether the field should receive focus automatically, from `properties.field.focus`.

- **Returns:** `boolean`

### `hasError`

Returns whether the field currently has a validation error.

- **Returns:** `boolean`

### `errorLabel`

Returns the localized error message. Sources in priority order:

1. `properties.field.errorLabel` (explicit override, translated if a valid i18n key)
2. `this.error` (set by `invalidate()`)

- **Returns:** `string`

### `disabled`

Returns whether the field is disabled, from `properties.field.disabled`.

- **Returns:** `boolean`

## Methods

### `emptyModel()`

Returns the "empty" value for this field type. Override in concrete field components to return a type-appropriate default (e.g. `''`, `[]`, `{}`).

- **Returns:** `null` by default.

### `isEmpty()`

Checks whether the current model is equal to the empty model.

- **Returns:** `boolean`

### `value()`

Returns the current model value. Override to add transformation logic before the value is read by the form.

- **Returns:** the current `model`.

### `fill(value)`

Sets the model to `value` and clears any existing error.

- **Parameters:**
  - `value` *(any)*: The value to set.

### `clear()`

Resets the model to the field's default value (`properties.default`) or to `emptyModel()` if no default is defined.

### `validate()`

Clears the current error, marking the field as valid.

### `invalidate(error)`

Sets the error message, marking the field as invalid.

- **Parameters:**
  - `error` *(string)*: The error message to display.

### `async onChanged()`

Should be called (or bound to an input event such as `blur`) whenever the model changes. It normalises `null` models for non-nullable fields, then emits a `field-changed` event so the parent form can re-validate.

- **Emits:** `field-changed(propertyName, model)`

::: tip
Bind `onChanged` to Quasar's [`@update:modelValue`](https://quasar.dev/vue-components/input#QInput-API) or `@blur` to trigger form validation on user interaction.
:::

### `apply(object, field)`

Applies the current field value onto `object[field]`. Override in concrete field components to perform custom transformations before the form is submitted.

- **Parameters:**
  - `object` *(Object)*: The target object being built for submission.
  - `field` *(string)*: The key on `object` to set.

### `submitted(object, field)`

Called after the form has been successfully submitted. Does nothing by default — override to perform post-submission side effects.

- **Parameters:**
  - `object` *(Object)*: The service response object.
  - `field` *(string)*: The field name.

### `onHelperDialogConfirmed(context)`

Handler called when a helper dialog is confirmed. If `context.url` is set, opens it in a new browser tab using Quasar's `openURL`.

- **Parameters:**
  - `context` *(Object)*: The dialog confirmation context.

## Lifecycle

- **`created`**: if `values` is set, calls `updateValue(values[properties.name])` to initialise the model.

## Watch

| Source | Behaviour |
|--------|-----------|
| `values` | When `values` changes, calls `updateValue(values[properties.name])` to sync the model, or `clear()` if `values` becomes `null`. |
